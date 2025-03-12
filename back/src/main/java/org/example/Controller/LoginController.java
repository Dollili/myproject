package org.example.Controller;


import lombok.RequiredArgsConstructor;
import org.example.Service.UserService;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> params) {
        try {
            if (params.get("pwd") == null) {
                return ResponseEntity.badRequest().body("password is null");
            }

            Map<String, Object> user = userService.join(params);
            if (user == null) {
                return ResponseEntity.internalServerError()
                        .body("cannot register");
            }

            HttpStatus status = user.get("duplicate") != null && !((boolean) user.get("duplicate")) ? HttpStatus.OK : HttpStatus.CREATED;
            return ResponseEntity.status(status).body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
