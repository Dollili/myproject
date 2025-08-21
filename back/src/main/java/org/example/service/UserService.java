package org.example.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.common.exception.ResourceConflictException;
import org.example.common.exception.ResourceNotFoundException;
import org.example.common.util.JwtTokenProvider;
import org.example.repository.UserMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final StringRedisTemplate stringRedisTemplate;

    public ResponseEntity<?> login(Map<String, Object> params, HttpServletResponse response) {
        String username = params.get("id").toString();
        String password = params.get("pwd").toString();
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        List<String> roles = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        String token = jwtTokenProvider.createToken(username, roles);
        String refreshToken = jwtTokenProvider.createRefreshToken(username);
        long maxAge = jwtTokenProvider.getValidityInMilliseconds() / 1000;

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS 환경에서만 전달
        cookie.setPath("/");
        cookie.setMaxAge((int) maxAge); // 1시간
        response.addCookie(cookie);

        stringRedisTemplate.opsForValue().set("RT:" + username, refreshToken, 7, TimeUnit.DAYS);

        Map<String, Object> map = new HashMap<>();
        map.put("result", userMapper.userInfo(params));
        map.put("time", System.currentTimeMillis() + jwtTokenProvider.getValidityInMilliseconds());

        return ResponseEntity.ok(map);
    }

    public void logoutToken(String token, HttpServletResponse response) {
        if (token != null && jwtTokenProvider.validateToken(token)) {
            jwtTokenProvider.blacklistToken(token);
        }
        tokenInit(token, response);
    }

    public void join(Map<String, Object> params) {
        if (params.get("id") == null || params.get("pwd") == null) {
            throw new ResourceNotFoundException("아이디, 패스워드를 모두 입력해주세요.");
        }
        String userId = (String) params.get("id");
        String userNic = (String) params.get("nic");
        String userEmail = (String) params.get("email");

        if (userNic == null) {
            params.put("nic", userId);
        }

        if (!userId.matches("^[a-zA-Z0-9]+$")) {
            throw new ResourceConflictException("아이디는 영문자, 숫자만 입력 가능합니다.");
        } else if (!userEmail.matches("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")) {
            throw new ResourceConflictException("이메일 형식이 유효하지 않습니다.");
        }

        Map<String, Object> user = userMapper.findUserId(userId);
        Map<String, Object> nic = userMapper.findUserNic(userNic);

        if (user != null) {
            throw new ResourceConflictException("사용 중인 아이디 입니다.");
        } else if (nic != null) {
            throw new ResourceConflictException("사용 중인 닉네임 입니다.");
        }

        String password = passwordEncoder((String) params.get("pwd"));
        params.put("pwd", password);

        userMapper.insertUser(params);
    }

    public Map<String, Object> findUserInfo(Map<String, Object> params) {
        Map<String, Object> info = new HashMap<>();

        info.put("info", userMapper.userInfo(params));
        info.put("boardList", userMapper.userBoard(params));
        info.put("commentList", userMapper.userComment(params));
        info.put("tempList", userMapper.userTemp(params));
        return info;
    }

    public ResponseEntity<?> updateUserInfo(Map<String, Object> params) throws Exception {
        String pwd = (String) params.get("pwd");
        String nic = (String) params.get("nic");
        Map<String, Object> user_nic = userMapper.findUserNic(nic);
        if (user_nic != null) {
            if (!user_nic.get("USER_ID").equals(params.get("id"))) {
                throw new ResourceConflictException("중복된 닉네임이 존재합니다.");
            }
        }

        if (StringUtils.hasText(pwd)) {
            params.put("pwd", passwordEncoder(pwd));
        }

        int result = userMapper.updateUserInfo(params);

        if (pwd.isEmpty() && result == 1) {
            return ResponseEntity.noContent().build(); // 패스워드 수정 없이
        } else if (result != 1) {
            throw new Exception("업데이트 실패");
        }
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> findUserPwd(Map<String, Object> params) throws Exception {
        String code = params.get("code").toString();
        String email = params.get("email").toString();
        String pwd = params.get("pwd").toString();
        int count = userMapper.findPwd(params);

        if (count == 0) {
            throw new ResourceNotFoundException("사용자를 찾을 수 없습니다.");
        }

        if (code.isEmpty()) {
            String random = String.valueOf((int) (Math.random() * 900000) + 100000);
            String result = emailService.send(random, email);
            return ResponseEntity.ok().body(result);
        } else {
            if (emailService.getCode(code)) {
                params.put("pwd", passwordEncoder(pwd));
                int result = userMapper.updateUserPwd(params);
                if (result == 1) {
                    emailService.deleteData(code);
                    return ResponseEntity.ok().body("비밀번호가 변경되었습니다. 로그인 화면으로 이동합니다.");
                } else {
                    throw new Exception("비밀번호 변경에 실패하였습니다. 관리자에게 문의바랍니다.");
                }
            } else {
                throw new ResourceNotFoundException("잘못된 인증 코드입니다.");
            }
        }
    }

    public ResponseEntity<?> refreshToken(String token, HttpServletResponse response) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new ResourceNotFoundException("Token validate fail.");
        }
        String username = jwtTokenProvider.getUsername(token);

        String saveRt = stringRedisTemplate.opsForValue().get("RT:" + username);
        if (saveRt == null) {
            throw new ResourceNotFoundException("Not found token.");
        }

        List<String> roles = jwtTokenProvider.getRoles(token);
        String newToken = jwtTokenProvider.createToken(username, roles);
        //String newRefreshToken = jwtTokenProvider.createRefreshToken(username);

        Cookie cookie = new Cookie("token", newToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS 환경에서만 전달
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtTokenProvider.getValidityInMilliseconds() / 1000)); // 1시간
        response.addCookie(cookie);

        jwtTokenProvider.blacklistToken(token);
        //stringRedisTemplate.opsForValue().set("RT:" + username, newRefreshToken, 7, TimeUnit.DAYS);

        Map<String, Object> map = new HashMap<>();
        map.put("result", "success");
        map.put("time", System.currentTimeMillis() + jwtTokenProvider.getValidityInMilliseconds());

        return ResponseEntity.ok().body(map);
    }

    public String passwordEncoder(String password) {
        return bCryptPasswordEncoder.encode(password);
    }

    public void deleteUserInfo(Map<String, Object> params, HttpServletResponse response) {
        int result = userMapper.deleteUserInfo(params);
        if (result != 1) {
            throw new ResourceNotFoundException("해당 사용자를 찾을 수 없습니다.");
        }
        String token = params.get("token").toString();
        tokenInit(token, response);
    }

    public void tokenInit(String token, HttpServletResponse response) {
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsername(token);
            stringRedisTemplate.delete("RT:" + username);
        }
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

}
