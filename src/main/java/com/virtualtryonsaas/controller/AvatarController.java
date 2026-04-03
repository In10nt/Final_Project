package com.virtualtryonsaas.controller;

import com.virtualtryonsaas.dto.AvatarCustomizationRequest;
import com.virtualtryonsaas.dto.AvatarResponse;
import com.virtualtryonsaas.service.AvatarGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avatar")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AvatarController {

    @Autowired
    private AvatarGenerationService avatarGenerationService;

    @PostMapping("/generate")
    public ResponseEntity<AvatarResponse> generateAvatar(@RequestBody AvatarCustomizationRequest request) {
        AvatarResponse response = avatarGenerationService.generateAvatar(
            request.getUserId(),
            request
        );
        return ResponseEntity.ok(response);
    }
}
