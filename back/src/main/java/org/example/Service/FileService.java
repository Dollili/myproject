package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Repository.FileMapper;
import org.example.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileMapper fileMapper;
    @Value("${file.upload.path}")
    private String filePath;
    @Value("${file.upload}")
    private String fileUpload;

    public ResponseEntity<?> fileUpload(MultipartFile[] files, String no) {
        List<Map<String, Object>> list = new ArrayList<>();
        int seq = 0;
        for (MultipartFile file : files) {
            File uploadDir = new File(filePath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Map<String, Object> map = new HashMap<>();
            String fileName = file.getOriginalFilename();
            String fileId = (fileName != null && !fileName.isEmpty()) ? fileName
                    : "FILE_" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 12);
            seq = seq + 1;

            String encryptedFileName = CryptoUtil.encryptSHA256(fileId + "_" + seq);
            String filePathFinal = filePath + "/" + encryptedFileName;

            try {
                file.transferTo(new File(fileUpload + "/" + encryptedFileName));
                map.put("fileId", fileId);

                int board_no = Integer.parseInt(no);
                map.put("no", board_no);
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
}
