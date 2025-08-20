package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.service.HomeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/board")
public class HomeController {
    Logger logger = LoggerFactory.getLogger(HomeController.class);
    @Autowired
    private HomeService homeService;

    @GetMapping("/list")
    public Map<String, Object> board(@RequestParam Map<String, Object> params) {
        return homeService.getBoardList(params);
    }

    @GetMapping("/detail")
    public Map<String, Object> boardDetail(@RequestParam Map<String, Object> param, Authentication authentication, HttpServletRequest request) {
        String username = request.getRemoteAddr(); // 비로그인 IP
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            username = authentication.getName(); // 로그인한 사용자 ID
        }

        param.put("id", username);
        return homeService.getBoardDetail(param);
    }

    @PostMapping("/detail")
    public int boardInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        return homeService.insertBoard(param);
    }

    @PutMapping("/detail/modify")
    public ResponseEntity<Void> boardModify(@RequestBody Map<String, Object> param) {
        homeService.modifyBoard(param);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/detail")
    public ResponseEntity<Void> boardDelete(@RequestBody Map<String, Object> param) {
        homeService.deleteBoard(param);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/detail/recommend")
    public ResponseEntity<?> boardRecUp(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        homeService.recommendUp(param);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/comment")
    public List<Map<String, Object>> commentGet(@RequestParam Map<String, Object> param) {
        return homeService.getBoardComment(param);
    }

    @PostMapping("/comment")
    public int commentInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        return homeService.insertComment(param);
    }

    @PutMapping("/comment/delete")
    public ResponseEntity<?> commentDelete(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        homeService.deleteComment(param);
        return ResponseEntity.noContent().build();
    }

}
