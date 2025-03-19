package org.example.Controller;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class LoginController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        String id = params.get("id").toString();
        String pwd = params.get("pwd").toString();

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(id, pwd));

            HttpSession session = request.getSession();
            session.setAttribute("user", authentication.getName());

            Map<String, Object> result = userService.findUserInfo(params);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/idCheck")
    public String sameId(@RequestBody Map<String, Object> params) {
        return userService.findUserId(params);
    }

    @GetMapping("/user")
    public Map<String, Object> getUserInfo(@RequestParam Map<String, Object> params) {
        return userService.findUserInfo(params);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> params) {
        try {
            int user = userService.join(params);
            if (user < 1) {
                return ResponseEntity.internalServerError()
                        .body("cannot register");
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
