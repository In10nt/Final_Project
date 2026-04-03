package com.virtualtryonsaas.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "*")
public class StaticFileController {

    @GetMapping("/uploads/models/mannequin.fbx")
    public ResponseEntity<byte[]> serveMannequinFBX() {
        try {
            Resource resource = new ClassPathResource("static/uploads/models/mannequin.fbx");
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = resource.getInputStream().readAllBytes();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentLength(fileContent.length);
            headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            headers.set(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000");
            
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/uploads/models/**")
    public ResponseEntity<byte[]> serveModelFile(@RequestParam(required = false) String path) {
        try {
            // Extract the path from the request URI
            String requestPath = path != null ? path : "mannequin.fbx";
            
            Resource resource = new ClassPathResource("static/uploads/models/" + requestPath);
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = resource.getInputStream().readAllBytes();
            
            // Determine content type based on file extension
            String contentType = "application/octet-stream";
            if (requestPath.endsWith(".obj")) {
                contentType = "model/obj";
            } else if (requestPath.endsWith(".fbx")) {
                contentType = "application/octet-stream";
            } else if (requestPath.endsWith(".gltf")) {
                contentType = "model/gltf+json";
            } else if (requestPath.endsWith(".glb")) {
                contentType = "model/gltf-binary";
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(fileContent.length);
            headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            headers.set(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000");
            
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
