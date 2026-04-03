package com.virtualtryonsaas.controller;

import com.virtualtryonsaas.dto.SizeRecommendationRequest;
import com.virtualtryonsaas.dto.SizeRecommendationResponse;
import com.virtualtryonsaas.service.SizeRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/size-recommendation")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SizeRecommendationController {

    @Autowired
    private SizeRecommendationService sizeRecommendationService;

    @PostMapping
    public ResponseEntity<SizeRecommendationResponse> getRecommendation(
            @RequestBody SizeRecommendationRequest request) {
        SizeRecommendationResponse response = sizeRecommendationService.recommendSize(
            request.getUserId(),
            request.getProductId()
        );
        return ResponseEntity.ok(response);
    }
}
