package org.example.Controller;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/login")
public class LoginController {

    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> params, HttpSession session) {
        Map<String, Object> result = userService.userLogin(params);

        if (result != null) {
            result.remove("USER_PWD");
            session.setAttribute("user", result);
            System.out.println("######" + session.getAttribute("user"));
        }

        return ResponseEntity.ok(result);
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
