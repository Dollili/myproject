package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.service.ImgBoardService;
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
@RequestMapping("/board")
public class ImgBoardController {
    Logger logger = LoggerFactory.getLogger(HomeController.class);
    @Autowired
    private ImgBoardService imgBoardService;

    @GetMapping("/imgList")
    public Map<String, Object> board(@RequestParam Map<String, Object> params) {
        return imgBoardService.getBoardList(params);
    }

    @GetMapping("/imgDetail")
    public Map<String, Object> boardDetail(@RequestParam Map<String, Object> param, Authentication authentication, HttpServletRequest request) {
        String username = request.getRemoteAddr(); // 비로그인 IP
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            username = authentication.getName(); // 로그인한 사용자 ID
        }

        param.put("id", username);
        return imgBoardService.getBoardDetail(param);
    }

    @PostMapping("/imgDetail")
    public int boardInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        return imgBoardService.insertBoard(param);
    }

    @PutMapping("/imgDetail/modify")
    public ResponseEntity<Void> boardModify(@RequestBody Map<String, Object> param) {
        imgBoardService.modifyBoard(param);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/imgDetail")
    public ResponseEntity<Void> boardDelete(@RequestBody Map<String, Object> param) {
        imgBoardService.deleteBoard(param);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/imgDetail/recommend")
    public ResponseEntity<?> boardRecUp(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        return imgBoardService.recommendUp(param);
    }

    @GetMapping("/iComment")
    public List<Map<String, Object>> commentGet(@RequestParam Map<String, Object> param) {
        return imgBoardService.getBoardComment(param);
    }

    @PostMapping("/iComment")
    public int commentInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        return imgBoardService.insertComment(param);
    }

    @PutMapping("/iComment/delete")
    public ResponseEntity<?> commentDelete(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        imgBoardService.deleteComment(param);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/imgList/rank")
    public List<Map<String, Object>> rank() {
        return imgBoardService.getRank();
    }

    @GetMapping("/rankComment")
    public List<Map<String, Object>> rCommentGet(@RequestParam Map<String, Object> param) {
        return imgBoardService.getBoardRComment(param);
    }

    @PostMapping("/rankComment")
    public int rCommentInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        return imgBoardService.insertRComment(param);
    }

    @PutMapping("/rankComment/delete")
    public ResponseEntity<?> rCommentDelete(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("user", username);
        imgBoardService.deleteRComment(param);
        return ResponseEntity.ok().build();
    }
}
