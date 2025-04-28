package org.example.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.Repository.UserMapper;
import org.example.util.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.LoginException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    Logger logger = LoggerFactory.getLogger(UserService.class);

    public Map<String, Object> login(Map<String, Object> params, HttpServletResponse response) throws LoginException {
        String username = params.get("id").toString();
        String password = params.get("pwd").toString();

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String token = jwtTokenProvider.createToken(username, roles);
        long maxAge = jwtTokenProvider.getValidityInMilliseconds() / 1000;

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS 환경에서만 전달
        cookie.setPath("/");
        cookie.setMaxAge((int) maxAge); // 1시간
        response.addCookie(cookie);

        Map<String, Object> map = new HashMap<>();
        map.put("result", userMapper.userInfo(params));
        map.put("time", System.currentTimeMillis() + jwtTokenProvider.getValidityInMilliseconds());

        return map;
    }

    public ResponseEntity<String> join(Map<String, Object> params) {
        if (params.get("id") == null || params.get("pwd") == null) {
            logger.error("params is null");
            throw new RuntimeException("Required fields");
        }
        String userId = (String) params.get("id");
        String userNic = (String) params.get("nic");
        Map<String, Object> user = userMapper.findUserId(userId);
        Map<String, Object> nic = userMapper.findUserNic(userNic);

        if (user != null) {
            return ResponseEntity.status(409).body("Duplicate ID");
        } else if (nic != null) {
            return ResponseEntity.status(418).body("Duplicate NIC");
        }

        if (userNic == null) {
            params.put("nic", userId);
        }
        String password = bCryptPasswordEncoder.encode((String) params.get("pwd"));
        params.put("pwd", password);

        int result = userMapper.insertUser(params);
        if (result == 1) {
            logger.info("join success");
            return ResponseEntity.ok("success");
        } else {
            logger.info("join failed");
            return ResponseEntity.internalServerError().body("fail");
        }
    }

    public Map<String, Object> findUserInfo(Map<String, Object> params) {
        Map<String, Object> info = new HashMap<>();

        info.put("info", userMapper.userInfo(params));
        info.put("boardList", userMapper.userBoard(params));
        info.put("commentList", userMapper.userComment(params));
        info.put("tempList", userMapper.userTemp(params));
        return info;
    }

    public ResponseEntity<String> updateUserInfo(Map<String, Object> params) {
        String pwd = (String) params.get("pwd");
        String nic = (String) params.get("nic");
        Map<String, Object> user_nic = userMapper.findUserNic(nic);
        if (user_nic != null) {
            if (!user_nic.get("USER_ID").equals(params.get("id"))) {
                return ResponseEntity.status(418).body("Duplicate NIC");
            }
        }
        int pwd_ok = 0;
        if (pwd != null && !pwd.isEmpty()) {
            String password = bCryptPasswordEncoder.encode(pwd);
            params.put("pwd", password);
            pwd_ok = 1;
        }
        int result = userMapper.updateUserInfo(params);

        if (pwd_ok == 1 && result == 1) {
            logger.info("update success");
            return ResponseEntity.noContent().build();
        } else if (result == 1) {
            logger.info("update success(no pwd)");
            return ResponseEntity.status(501).build();
        } else {
            logger.info("update failed");
            return ResponseEntity.internalServerError().body("fail");
        }
    }

    public ResponseEntity<?> refreshToken(String token) {
        if (jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsername(token);
            List<String> roles = jwtTokenProvider.getRoles(token);
            String newToken = jwtTokenProvider.createToken(username, roles);

            String cookie = ResponseCookie.from("token", newToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge((int) (jwtTokenProvider.getValidityInMilliseconds() / 1000))
                    .build()
                    .toString();

            Map<String, Object> map = new HashMap<>();
            map.put("result", "success");
            map.put("time", System.currentTimeMillis() + jwtTokenProvider.getValidityInMilliseconds());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie)
                    .body(map);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
