package org.example.controller;


import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.service.UserService;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> params, HttpServletResponse response) {
        return userService.login(params, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        userService.logoutToken(refreshToken, response);
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

    @PutMapping("/user/delete")
    public ResponseEntity<?> deleteUserInfo(@CookieValue(name = "refreshToken", required = false) String refreshToken, @RequestBody Map<String, Object> params, Authentication authentication, HttpServletResponse response) {
        String username = authentication.getName();
        params.put("token", refreshToken);
        params.put("id", username);
        return userService.deleteUserInfo(params, response);
    }

}
