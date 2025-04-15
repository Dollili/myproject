package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Repository.BoardMapper;
import org.example.Repository.FileMapper;
import org.example.util.CryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileMapper fileMapper;
    private final BoardMapper boardMapper;
    Logger logger = LoggerFactory.getLogger(FileService.class);
    @Value("${file.upload.path}")
    private String filePath;

    public ResponseEntity<?> fileUpload(MultipartFile[] files, String no) {
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
                logger.error(e.getMessage());
                try {
                    throw new IOException("파일 업로드 중 문제가 발생했습니다.");
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
        }
        return ResponseEntity.ok(list);
    }

    public ResponseEntity<?> tempFile(MultipartFile file) {
        Map<String, String> result = new HashMap<>();
        try {
            String saveName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File uploadDir = new File(filePath + "temp");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Path tempPath = uploadDir.toPath().resolve(saveName);
            Files.copy(file.getInputStream(), tempPath);

            String fileUrl = "/files/temp/" + saveName;

            result.put("url", fileUrl);
        } catch (IOException e) {
            logger.error(e.getMessage());
            try {
                throw new IOException("파일 업로드 중 문제가 발생했습니다.");
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
        return ResponseEntity.ok(result);
    }

    public ResponseEntity<?> deleteFile(List<String> files) {
        try {
            for (String id : files) {
                fileMapper.deleteFile(id);
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

}
