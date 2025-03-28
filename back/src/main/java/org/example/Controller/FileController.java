package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile[] files, @RequestParam("no") String no) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("files is null or empty");
        }
        return fileService.fileUpload(files, no);
    }

}
