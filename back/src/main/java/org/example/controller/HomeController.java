package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.service.HomeService;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/board")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

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
    public void boardInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        homeService.insertBoard(param);
    }

    @PutMapping("/detail/modify")
    public void boardModify(@RequestBody Map<String, Object> param) {
        homeService.modifyBoard(param);
    }

    @PutMapping("/detail")
    public void boardDelete(@RequestBody Map<String, Object> param) {
        homeService.deleteBoard(param);
    }

    @PutMapping("/detail/recommend")
    public void boardRecUp(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        homeService.recommendUp(param);
    }

    @GetMapping("/comment")
    public List<Map<String, Object>> commentGet(@RequestParam Map<String, Object> param) {
        return homeService.getBoardComment(param);
    }

    @PostMapping("/comment")
    public void commentInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        homeService.insertComment(param);
    }

    @PutMapping("/comment/delete")
    public void commentDelete(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        homeService.deleteComment(param);
    }

}
