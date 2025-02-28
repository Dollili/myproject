package org.example.Controller;

import org.example.Service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
