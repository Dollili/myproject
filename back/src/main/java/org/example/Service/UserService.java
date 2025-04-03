package org.example.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.Repository.UserMapper;
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
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> login(Map<String, Object> params, HttpServletRequest request) {
        String username = params.get("id").toString();
        if (username.contains("TESTADMIN")) {
            params.put("role", "M");
        }
        String password = params.get("pwd").toString();
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        SecurityContext securityContext = new SecurityContextImpl(authentication);
        SecurityContextHolder.setContext(securityContext);

        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        session.setAttribute("user", authentication.getName());

        return this.findUserInfo(params);
    }

    public ResponseEntity<String> join(Map<String, Object> params) {
        if (params.get("id") == null || params.get("pwd") == null) {
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
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.internalServerError().body("fail");
        }
    }

    public Map<String, Object> findUserInfo(Map<String, Object> params) {
        List<Map<String, Object>> boardList = userMapper.userBoard(params);
        List<Map<String, Object>> commentList = userMapper.userComment(params);

        Map<String, Object> info = new HashMap<>();
        info.put("info", userMapper.userInfo(params));
        info.put("boardList", boardList);
        info.put("commentList", commentList);
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
        if (pwd != null && !pwd.isEmpty()) {
            String password = bCryptPasswordEncoder.encode(pwd);
            params.put("pwd", password);
        }
        int result = userMapper.updateUserInfo(params);

        if (result == 1) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.internalServerError().body("fail");
        }
    }

}
