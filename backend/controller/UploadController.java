package com.ubt.restaurant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final Path UPLOAD_DIR = Paths.get("uploads");

    @PostMapping("/image")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File-i eshte bosh");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vetem imazhe lejohen");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Madhesia max 5MB");
        }

        Files.createDirectories(UPLOAD_DIR);
        String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")
            ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'))
            : ".jpg";
        String filename = UUID.randomUUID() + ext;
        Path target = UPLOAD_DIR.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return Map.of("url", "/uploads/" + filename);
    }
}