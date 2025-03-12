package org.example.Controller;


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

    @GetMapping("")
    public ResponseEntity<?> login(@RequestParam Map<String, Object> params) {
        Map<String, Object> result = userService.userLogin(params);
        if (result != null) {
            result.remove("USER_PWD");
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/sameId")
    public String sameId(@RequestParam Map<String, Object> params) {
        return userService.findUserId(params);
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
