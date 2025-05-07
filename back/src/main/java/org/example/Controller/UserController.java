package org.example.Controller;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        userService.logoutToken(refreshToken);

        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        Cookie rtCookie = new Cookie("refreshToken", null);
        rtCookie.setHttpOnly(true);
        rtCookie.setMaxAge(0);
        rtCookie.setPath("/");
        response.addCookie(rtCookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public Map<String, Object> getUserInfo(@RequestParam Map<String, Object> params) {
        return userService.findUserInfo(params);
    }

    @PutMapping("/user")
    public ResponseEntity<?> updateUserInfo(@RequestBody Map<String, Object> params, Authentication authentication) {
        String username = authentication.getName();
        params.put("id", username);
        return userService.updateUserInfo(params);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> params) {
        return userService.join(params);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> reLogin(@CookieValue(value = "refreshToken", required = true) String token, HttpServletResponse response) {
        return userService.refreshToken(token, response);
    }

    @PostMapping("/findPwd")
    public ResponseEntity<?> findPwd(@RequestBody Map<String, Object> params) throws Exception {
        return userService.findUserPwd(params);
    }

}
