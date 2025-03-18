package org.example.Controller;

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

    @DeleteMapping("/detail")
    public ResponseEntity<Void> boardDelete(@RequestParam int no) {
        int result = homeService.deleteBoard(no);
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

    @PostMapping("/comment")
    public int commentInsert(@RequestBody Map<String, Object> param) {
        return homeService.insertComment(param);
    }

    @DeleteMapping("/comment/delete")
    public ResponseEntity<Void> commentDelete(@RequestParam int id) {
        int result = homeService.deleteComment(id);
        if (result == 1) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
