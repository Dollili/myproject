package org.example.Service;

import org.example.Repository.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    @Autowired
    private BoardMapper boardMapper;

    public List<Map<String, Object>> getBoardList() {
        return boardMapper.getBoardList();
    }
}
