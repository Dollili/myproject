package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.common.exception.ResourceNotFoundException;
import org.example.repository.BoardMapper;
import org.example.repository.FileMapper;
import org.example.common.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileMapper fileMapper;
    private final BoardMapper boardMapper;
    @Value("${file.upload.path}")
    private String filePath;

    public ResponseEntity<?> fileUpload(MultipartFile[] files, String no) {
        if (files == null || files.length == 0) {
            throw new ResourceNotFoundException("파일이 존재하지 않습니다.");
        }

        List<Map<String, Object>> list = new ArrayList<>();
        int seq = 0;
        for (MultipartFile file : files) {
            File uploadDir = new File(filePath + "attach");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Map<String, Object> map = new HashMap<>();
            String fileName = file.getOriginalFilename();
            String fileId = "FILE_" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 12);
            seq = seq + 1;

            String encryptedFileName = CryptoUtil.encryptSHA256(fileId + "_" + seq);
            String filePathFinal = uploadDir.getPath() + "/" + encryptedFileName;

            try {
                file.transferTo(new File(uploadDir.getPath() + "/" + encryptedFileName));
                map.put("id", fileId);

                if (no == null || no.isEmpty()) {
                    int board_no = boardMapper.boardMax();
                    map.put("no", board_no);
                } else {
                    int board_no = Integer.parseInt(no);
                    map.put("no", board_no);
                }
                map.put("name", encryptedFileName);
                map.put("orgNm", fileName);
                map.put("filePath", filePathFinal);
                map.put("size", file.getSize());
                fileMapper.insertFile(map);

                list.add(map);
            } catch (IOException e) {
                try {
                    throw new IOException("파일 업로드 중 문제가 발생했습니다.");
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
        }
        return ResponseEntity.ok(list);
    }

    public ResponseEntity<?> tempFile(MultipartFile file, String name) {
        Map<String, String> result = new HashMap<>();
        try {
            String saveName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File uploadDir = new File(filePath + "temp");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Path tempPath;
            if (name == null || name.isEmpty()) {
                tempPath = uploadDir.toPath().resolve(saveName);
                String fileUrl = "/files/temp/" + saveName;
                result.put("url", fileUrl);
                result.put("name", saveName);
            } else {
                tempPath = uploadDir.toPath().resolve(name);
                result.put("success", "true");
            }

            // 덮어쓰기 허용
            Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            try {
                throw new IOException("파일 업로드 중 문제가 발생했습니다.");
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
        return ResponseEntity.ok(result);
    }

    @Transactional
    public void deleteFile(List<String> files) {
        try {
            for (String id : files) {
                fileMapper.deleteFile(id);
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException("파일 삭제 실패");
        }
    }

}
