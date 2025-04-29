package org.example.Controller;

import org.example.Service.ImgBoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public Map<String, Object> boardDetail(@RequestParam Map<String, Object> no) {
        return imgBoardService.getBoardDetail(no);
    }

    @PostMapping("/imgDetail")
    public int boardInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        return imgBoardService.insertBoard(param);
    }

    @PutMapping("/imgDetail/modify")
    public ResponseEntity<Void> boardModify(@RequestBody Map<String, Object> param) {
        int result = imgBoardService.modifyBoard(param);

        if (result == 1) {
            logger.info("success modify board");
            return ResponseEntity.noContent().build();
        } else {
            logger.info("fail modify board");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/imgDetail")
    public ResponseEntity<Void> boardDelete(@RequestBody Map<String, Object> param) {
        int result = imgBoardService.deleteBoard(param);

        if (result == 1) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/imgDetail/recommend")
    public ResponseEntity<Void> boardRecUp(@RequestBody Map<String, Object> param) {
        int result = imgBoardService.recommendUp(param);
        if (result == 1) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/iComment")
    public List<Map<String, Object>> commentGet(@RequestParam Map<String, Object> param) {
        return imgBoardService.getBoardComment(param);
    }

    @PostMapping("/iComment")
    public int commentInsert(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        return imgBoardService.insertComment(param);
    }

    @PutMapping("/iComment/delete")
    public ResponseEntity<?> commentDelete(@RequestBody Map<String, Object> param, Authentication authentication) {
        String username = authentication.getName();
        param.put("id", username);
        return imgBoardService.deleteComment(param);
    }
}
