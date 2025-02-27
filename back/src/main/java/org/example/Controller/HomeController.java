package org.example.Controller;

import org.example.Service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @GetMapping("/home")
    public List<Map<String, Object>> home() {
        return homeService.getBoardList();
    }
}
