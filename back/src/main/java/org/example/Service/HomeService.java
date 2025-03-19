package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Repository.BoardMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class HomeService {

    private final BoardMapper boardMapper;

    public List<Map<String, Object>> getBoardList(Map<String, Object> params) {
        return boardMapper.getBoardList(params);
    }

    public Map<String, Object> getBoardDetail(Map<String, Object> no) {
        boardMapper.viewCount(no);
        Map<String, Object> board = boardMapper.getBoardDetail(no);
        board.put("comment", boardMapper.getBoardComment(no));
        return board;
    }

    public int recommendUp(Map<String, Object> param) {
        return boardMapper.recommendUp(param);
    }

    public int insertBoard(Map<String, Object> param) {
        return boardMapper.insertBoard(param);
    }

    public int deleteBoard(Map<String, Object> param) {
        return boardMapper.deleteBoard(param);
    }

    public int insertComment(Map<String, Object> param) {
        return boardMapper.insertComment(param);
    }

    public int deleteComment(Map<String, Object> param) {
        return boardMapper.deleteComment(param);
    }
}
