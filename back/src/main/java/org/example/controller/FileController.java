package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile[] files, @RequestParam(value = "no", required = false) String no) {
        return fileService.fileUpload(files, no);
    }

    @PostMapping("/upload/temp")
    public ResponseEntity<?> uploadTemp(@RequestParam("file") MultipartFile file, @RequestParam(value = "name", required = false) String name) {
        return fileService.tempFile(file, name);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody List<String> params) {
        fileService.deleteFile(params);
    }

}
