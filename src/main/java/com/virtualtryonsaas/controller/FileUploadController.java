package com.virtualtryonsaas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    @PostMapping("/model")
    public ResponseEntity<?> uploadModel(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please select a file"));
            }

            // Get file extension
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            
            // Generate unique filename
            String filename = UUID.randomUUID().toString() + extension;
            
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR + "models");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return URL
            String fileUrl = "/uploads/models/" + filename;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please select a file"));
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            Path uploadPath = Paths.get(UPLOAD_DIR + "images");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "/uploads/images/" + filename;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/models/list")
    public ResponseEntity<?> listAvailableModels() {
        try {
            Path modelsPath = Paths.get(UPLOAD_DIR + "models");
            
            if (!Files.exists(modelsPath)) {
                return ResponseEntity.ok(Map.of("models", new String[0]));
            }
            
            java.util.List<Map<String, String>> models = new java.util.ArrayList<>();
            
            Files.list(modelsPath)
                .filter(path -> {
                    String filename = path.getFileName().toString().toLowerCase();
                    return filename.endsWith(".obj") || filename.endsWith(".glb") || filename.endsWith(".gltf");
                })
                .forEach(path -> {
                    String filename = path.getFileName().toString();
                    String url = "/uploads/models/" + filename;
                    Map<String, String> model = new HashMap<>();
                    model.put("filename", filename);
                    model.put("url", url);
                    model.put("name", filename.substring(0, filename.lastIndexOf(".")));
                    models.add(model);
                });
            
            return ResponseEntity.ok(Map.of("models", models));
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to list models: " + e.getMessage()));
        }
    }
}
