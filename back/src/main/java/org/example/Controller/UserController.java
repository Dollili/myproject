package org.example.Controller;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserController {
    private final UserService userService;
    Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> params, HttpServletResponse response) {
        try {
            Map<String, Object> result = userService.login(params, response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("로그인 실패:{}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public Map<String, Object> getUserInfo(@RequestParam Map<String, Object> params) {
        return userService.findUserInfo(params);
    }

    @PutMapping("/user")
    public ResponseEntity<?> updateUserInfo(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        HttpSession session = request.getSession();
        params.put("id", session.getAttribute("user"));
        return userService.updateUserInfo(params);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> params) {
        return userService.join(params);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> reLogin(@CookieValue("token") String token) {
        return userService.refreshToken(token);
    }

}
