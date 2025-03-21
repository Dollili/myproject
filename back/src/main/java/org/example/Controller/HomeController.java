package org.example.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.Service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/board")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @GetMapping("/list")
    public List<Map<String, Object>> board(@RequestParam Map<String, Object> params) {
        return homeService.getBoardList(params);
    }

    @GetMapping("/detail")
    public Map<String, Object> boardDetail(@RequestParam Map<String, Object> no) {
        return homeService.getBoardDetail(no);
    }

    @PostMapping("/detail")
    public int boardInsert(@RequestBody Map<String, Object> param) {
        return homeService.insertBoard(param);
    }

    @PutMapping("/detail")
    public ResponseEntity<Void> boardDelete(@RequestBody Map<String, Object> param) {
        int result = homeService.deleteBoard(param);

        if (result == 1) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/detail/recommend")
    public ResponseEntity<Void> boardRecUp(@RequestBody Map<String, Object> param) {
        int result = homeService.recommendUp(param);
        if (result == 1) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/comment")
    public List<Map<String, Object>> commentGet(@RequestParam Map<String, Object> param) {
        return homeService.getBoardComment(param);
    }

    @PostMapping("/comment")
    public int commentInsert(@RequestBody Map<String, Object> param) {
        return homeService.insertComment(param);
    }

    @PutMapping("/comment/delete")
    public ResponseEntity<?> commentDelete(@RequestBody Map<String, Object> param, HttpServletRequest request) {
        HttpSession session = request.getSession();
        param.put("user", session.getAttribute("user"));
        return homeService.deleteComment(param);
    }

}
