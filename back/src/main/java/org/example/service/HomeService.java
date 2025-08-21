package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.common.exception.ResourceNotFoundException;
import org.example.repository.BoardMapper;
import org.example.repository.FileMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class HomeService {
    private final BoardMapper boardMapper;
    private final FileMapper fileMapper;
    private final ViewCountService viewCountService;

    public Map<String, Object> getBoardList(Map<String, Object> params) {
        int page = params.get("page") == null ? 1 : Integer.parseInt((String) params.get("page"));
        int size = params.get("size") == null ? 10 : Integer.parseInt((String) params.get("size"));

        params.put("offset", (page - 1) * size);
        params.put("limit", size);

        List<Map<String, Object>> resultList = boardMapper.getBoardList(params);
        int total = boardMapper.getBoardListCnt(params);

        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("data", resultList);

        return result;
    }

    public Map<String, Object> getBoardDetail(Map<String, Object> param) {
        String category = "board";
        String no = param.get("no") == null ? "" : param.get("no").toString();
        String id = param.get("id") == null ? "" : param.get("id").toString();
        if (!viewCountService.hasUserPost(id, no, category)) {
            boardMapper.viewCount(no);
            viewCountService.markUserPost(id, no, category);
        }

        Map<String, Object> result = boardMapper.getBoardDetail(param);
        //file
        if (result != null) {
            result.put("file", fileMapper.getFileList((String) param.get("no")));
        }

        return result;
    }

    public void recommendUp(Map<String, Object> param) {
        String category = "recommendBoard";
        String no = param.get("no") == null ? "" : param.get("no").toString();
        String id = param.get("id") == null ? "" : param.get("id").toString();

        if (!viewCountService.hasUserPost(id, no, category)) {
            boardMapper.recommendUp(no);
            viewCountService.markUserPost(id, no, category);
        }
    }

    public void insertBoard(Map<String, Object> param) {
        boardMapper.insertBoard(param);
    }

    public void modifyBoard(Map<String, Object> param) {
        int result = boardMapper.updateBoard(param);
        if (result != 1) {
            throw new ResourceNotFoundException("수정 실패");
        }
    }

    @Transactional
    public void deleteBoard(Map<String, Object> param) {
        String no = param.get("no").toString();
        fileMapper.deleteAll(no); // 파일 삭제 처리
        boardMapper.deleteAllCom(no); // 댓글 삭제 처리
        int result = boardMapper.deleteBoard(param);
        if (result != 1) {
            throw new ResourceNotFoundException("삭제 실패");
        }
    }

    public List<Map<String, Object>> getBoardComment(Map<String, Object> param) {
        int page = param.get("page") == null ? 1 : Integer.parseInt((String) param.get("page"));
        int size = param.get("size") == null ? 10 : Integer.parseInt((String) param.get("size"));

        param.put("offset", (page - 1) * size);
        param.put("limit", size);

        return boardMapper.getBoardComment(param);
    }

    public void insertComment(Map<String, Object> param) {
        boardMapper.insertComment(param);
    }

    public void deleteComment(Map<String, Object> param) {
        int result = boardMapper.deleteComment(param);
        if (result != 1) {
            throw new ResourceNotFoundException("삭제 실패");
        }
    }

}
