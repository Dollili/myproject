package org.example.controller;


import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.service.UserService;
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
    public ResponseEntity<?> logout(@CookieValue(name = "token", required = false) String token, HttpServletResponse response) {
        userService.logoutToken(token, response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user")
    public Map<String, Object> getUserInfo(@RequestParam Map<String, Object> params) {
        return userService.findUserInfo(params);
    }

    @PutMapping("/user")
    public ResponseEntity<?> updateUserInfo(@RequestBody Map<String, Object> params, Authentication authentication) throws Exception {
        String username = authentication.getName();
        params.put("id", username);
        userService.updateUserInfo(params);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> params) throws Exception {
        userService.join(params);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> reLogin(@CookieValue(value = "token") String token, HttpServletResponse response) {
        return userService.refreshToken(token, response);
    }

    @PostMapping("/findPwd")
    public ResponseEntity<?> findPwd(@RequestBody Map<String, Object> params) throws Exception {
        return userService.findUserPwd(params);
    }

    @PutMapping("/user/delete")
    public void deleteUserInfo(@CookieValue(name = "token", required = false) String token, @RequestBody Map<String, Object> params, Authentication authentication, HttpServletResponse response) {
        String username = authentication.getName();
        params.put("token", token);
        params.put("id", username);
        userService.deleteUserInfo(params, response);
    }

}
