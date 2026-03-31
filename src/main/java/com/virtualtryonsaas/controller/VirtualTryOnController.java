package com.virtualtryonsaas.controller;

import com.virtualtryonsaas.dto.VirtualTryOnRequest;
import com.virtualtryonsaas.dto.VirtualTryOnResponse;
import com.virtualtryonsaas.service.VirtualTryOnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/virtual-tryon")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VirtualTryOnController {

    @Autowired
    private VirtualTryOnService virtualTryOnService;

    @PostMapping("/try-on")
    public ResponseEntity<VirtualTryOnResponse> performTryOn(@Valid @RequestBody VirtualTryOnRequest request) {
        VirtualTryOnResponse response = virtualTryOnService.performVirtualTryOn(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<VirtualTryOnResponse> getSessionResult(@PathVariable UUID sessionId) {
        VirtualTryOnResponse response = virtualTryOnService.getSessionResult(sessionId);
        return ResponseEntity.ok(response);
    }
}