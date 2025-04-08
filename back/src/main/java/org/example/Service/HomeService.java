package org.example.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.Repository.BoardMapper;
import org.example.Repository.FileMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
public class HomeService {
    private final BoardMapper boardMapper;
    private final FileMapper fileMapper;
    Logger logger = LoggerFactory.getLogger(HomeService.class);

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

    public Map<String, Object> getBoardDetail(Map<String, Object> no, HttpServletRequest request) {
        HttpSession session = request.getSession();
        Set<String> view = (Set<String>) session.getAttribute("view"); // 조회수 세션 임시

        if (view == null) {
            view = new HashSet<>();
            session.setAttribute("view", view);
        }

        if (!view.contains((String) no.get("no"))) {
            view.add((String) no.get("no"));
            boardMapper.viewCount(no);
        }

        Map<String, Object> result = boardMapper.getBoardDetail(no);
        //file
        if (result != null) {
            result.put("file", fileMapper.getFileList((String) no.get("no")));
        }

        return result;
    }

    public int recommendUp(Map<String, Object> param) {
        return boardMapper.recommendUp(param);
    }

    public int insertBoard(Map<String, Object> param) {
        return boardMapper.insertBoard(param);
    }

    public int modifyBoard(Map<String, Object> param) {
        return boardMapper.updateBoard(param);
    }

    public int deleteBoard(Map<String, Object> param) {
        String no = param.get("no").toString();
        fileMapper.deleteAll(no); // 파일 삭제 처리
        boardMapper.deleteAllCom(no); // 댓글 삭제 처리
        return boardMapper.deleteBoard(param);
    }

    public List<Map<String, Object>> getBoardComment(Map<String, Object> param) {
        int page = param.get("page") == null ? 1 : Integer.parseInt((String) param.get("page"));
        int size = param.get("size") == null ? 10 : Integer.parseInt((String) param.get("size"));

        param.put("offset", (page - 1) * size);
        param.put("limit", size);

        return boardMapper.getBoardComment(param);
    }

    public int insertComment(Map<String, Object> param) {
        return boardMapper.insertComment(param);
    }

    public ResponseEntity<?> deleteComment(Map<String, Object> param) {
        int result = boardMapper.deleteComment(param);
        if (result == 1) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(409).build();
        }
    }
}
