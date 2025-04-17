package org.example.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.Repository.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    Logger logger = LoggerFactory.getLogger(UserService.class);

    public Map<String, Object> login(Map<String, Object> params, HttpServletRequest request) throws Exception {
        String username = params.get("id").toString();
        String password = params.get("pwd").toString();

        Map<String, Object> info = userMapper.userInfo(params);
        if (info == null) {
            throw new Exception("사용자 정보가 일치하지 않습니다.");
        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        SecurityContext securityContext = new SecurityContextImpl(authentication);
        SecurityContextHolder.setContext(securityContext);

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        session.setAttribute("user", authentication.getName());

        return info;
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
        info.put("imgBoardList", userMapper.userImgBoard(params));
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

}
