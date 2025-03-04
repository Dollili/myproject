package org.example.Controller;

import org.example.Service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/board")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @GetMapping("")
    public List<Map<String, Object>> board() {
        return homeService.getBoardList();
    }

    @GetMapping("/detail")
    public Map<String, Object> boardDetail(@RequestParam int no) {
        return homeService.getBoardDetail(no);
    }

    @PostMapping("/detail")
    public int boardInsert(@RequestBody Map<String, Object> param) {
        return homeService.insertBoard(param);
    }

    @PutMapping("/detail/recommend")
    public ResponseEntity<Boolean> boardRecUp(@RequestBody Map<String, Object> param) {
        homeService.recommendUp(param);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/comment")
    public int commentInsert(@RequestBody Map<String, Object> param) {
        return homeService.insertComment(param);
    }

    @DeleteMapping("/comment/delete")
    public ResponseEntity<Boolean> commentDelete(@RequestParam int id) {
        homeService.deleteComment(id);
        return ResponseEntity.ok(true);
    }

}
