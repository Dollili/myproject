package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.common.exception.ResourceConflictException;
import org.example.common.exception.ResourceNotFoundException;
import org.example.repository.FileMapper;
import org.example.repository.ImageMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ImgBoardService {
    private final ImageMapper imageMapper;
    private final FileMapper fileMapper;
    private final ViewCountService viewCountService;

    public Map<String, Object> getBoardList(Map<String, Object> params) {
        int page = params.get("page") == null ? 1 : Integer.parseInt((String) params.get("page"));
        int size = params.get("size") == null ? 10 : Integer.parseInt((String) params.get("size"));

        params.put("offset", (page - 1) * size);
        params.put("limit", size);

        List<Map<String, Object>> resultList = imageMapper.getBoardList(params);
        int total = imageMapper.getBoardListCnt(params);

        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("data", resultList);

        return result;
    }

    public Map<String, Object> getBoardDetail(Map<String, Object> param) {
        String category = "imageBoard";
        String no = param.get("no") == null ? "" : param.get("no").toString();
        String id = param.get("id") == null ? "" : param.get("id").toString();
        if (!viewCountService.hasUserPost(id, no, category)) {
            imageMapper.viewCount(param);
            viewCountService.markUserPost(id, no, category);
        }

        Map<String, Object> result = imageMapper.getBoardDetail(param);
        //file
        if (result != null) {
            result.put("file", fileMapper.getFileList((String) param.get("no")));
        }

        return result;
    }

    public ResponseEntity<?> recommendUp(Map<String, Object> param) {
        String category = "recommendImg";
        String no = param.get("no") == null ? "" : param.get("no").toString();
        String id = param.get("id") == null ? "" : param.get("id").toString();

        if (!viewCountService.hasUserPost(id, no, category)) {
            imageMapper.recommendUp(no);
            viewCountService.markUserPost(id, no, category);
        } else {
            return ResponseEntity.status(515).build();
        }
        return ResponseEntity.ok().build();
    }

    public int insertBoard(Map<String, Object> param) {
        return imageMapper.insertBoard(param);
    }

    public void modifyBoard(Map<String, Object> param) {
        int result = imageMapper.updateBoard(param);
        if (result != 1) {
            throw new ResourceConflictException("등록 실패");
        }
    }

    @Transactional
    public void deleteBoard(Map<String, Object> param) {
        String no = param.get("no").toString();
        fileMapper.deleteAll(no); // 파일 삭제 처리
        imageMapper.deleteAllCom(no); // 댓글 삭제 처리
        int result = imageMapper.deleteBoard(param);
        if (result != 1) {
            throw new ResourceNotFoundException("게시글이 존재하지 않거나 삭제할 수 없습니다.");
        }
    }

    public List<Map<String, Object>> getBoardComment(Map<String, Object> param) {
        int page = param.get("page") == null ? 1 : Integer.parseInt((String) param.get("page"));
        int size = param.get("size") == null ? 10 : Integer.parseInt((String) param.get("size"));

        param.put("offset", (page - 1) * size);
        param.put("limit", size);

        return imageMapper.getBoardComment(param);
    }

    public int insertComment(Map<String, Object> param) {
        return imageMapper.insertComment(param);
    }

    public void deleteComment(Map<String, Object> param) {
        int result = imageMapper.deleteComment(param);
        if (result != 1) {
            throw new ResourceConflictException("삭제 권한이 없습니다.");
        }
    }

    public List<Map<String, Object>> getRank() {
        return imageMapper.selectRanking();
    }

    public List<Map<String, Object>> getBoardRComment(Map<String, Object> param) {
        int page = param.get("page") == null ? 1 : Integer.parseInt((String) param.get("page"));
        int size = param.get("size") == null ? 10 : Integer.parseInt((String) param.get("size"));

        param.put("offset", (page - 1) * size);
        param.put("limit", size);

        return imageMapper.getBoardRComment(param);
    }

    public int insertRComment(Map<String, Object> param) {
        return imageMapper.insertRComment(param);
    }

    public void deleteRComment(Map<String, Object> param) {
        int result = imageMapper.deleteRComment(param);
        if (result != 1) {
            throw new ResourceConflictException("삭제 권한이 없습니다.");
        }
    }
}
