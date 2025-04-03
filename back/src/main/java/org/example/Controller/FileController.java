package org.example.Controller;

import org.example.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile[] files, @RequestParam(value = "no", required = false) String no) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("files is null or empty");
        }
        return fileService.fileUpload(files, no);
    }

    @PutMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody List<String> params) {
        return fileService.deleteFile(params);
    }

}
