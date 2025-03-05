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

    public List<Map<String, Object>> getBoardList(Map<String, Object> params) {
        return boardMapper.getBoardList(params);
    }

    public Map<String, Object> getBoardDetail(int no) {
        boardMapper.viewCount(no);
        Map<String, Object> board = boardMapper.getBoardDetail(no);
        board.put("comment", boardMapper.getBoardComment(no));
        return board;
    }

    public void recommendUp(Map<String, Object> param) {
        boardMapper.recommendUp(param);
    }

    public int insertBoard(Map<String, Object> param) {
        return boardMapper.insertBoard(param);
    }

    public void deleteBoard(int no) {
        boardMapper.deleteBoard(no);
    }

    public int insertComment(Map<String, Object> param) {
        return boardMapper.insertComment(param);
    }

    public void deleteComment(int id) {
        boardMapper.deleteComment(id);
    }
}
