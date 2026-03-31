package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.VirtualTryOnRequest;
import com.virtualtryonsaas.dto.VirtualTryOnResponse;
import com.virtualtryonsaas.entity.BodyProfile;
import com.virtualtryonsaas.entity.Product;
import com.virtualtryonsaas.entity.TryOnSession;
import com.virtualtryonsaas.entity.User;
import com.virtualtryonsaas.repository.BodyProfileRepository;
import com.virtualtryonsaas.repository.ProductRepository;
import com.virtualtryonsaas.repository.TryOnSessionRepository;
import com.virtualtryonsaas.repository.UserRepository;
import com.virtualtryonsaas.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class VirtualTryOnService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BodyProfileRepository bodyProfileRepository;

    @Autowired
    private TryOnSessionRepository tryOnSessionRepository;

    @Autowired
    private AIService aiService;

    public VirtualTryOnResponse performVirtualTryOn(VirtualTryOnRequest request) {
        try {
            UUID tenantId = TenantContext.getCurrentTenant();
            
            // Get user by ID (simplified for demo)
            User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            BodyProfile bodyProfile = bodyProfileRepository.findByUserIdAndTenantId(request.getUserId(), tenantId)
                .orElse(null);
            
            if (bodyProfile == null) {
                return new VirtualTryOnResponse(false, "Body profile not found. Please create your profile first.");
            }
            
            // Get product
            Product product = productRepository.findByIdAndTenantId(request.getProductId(), tenantId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Create try-on session
            TryOnSession session = new TryOnSession();
            session.setUserId(request.getUserId());
            session.setTenantId(tenantId);
            session.setProductId(request.getProductId());
            session.setVariantId(request.getVariantId());
            
            // Generate virtual try-on using AI
            VirtualTryOnResponse response = aiService.generateVirtualTryOn(bodyProfile, product, request);
            
            // Update session with results
            session.setResultImageUrl(response.getResultImageUrl());
            session.setAvatarWithClothingUrl(response.getAvatarWithClothingUrl());
            session.setConfidenceScore(response.getConfidenceScore());
            session.setFitFeedback(response.getFitFeedback());
            
            session = tryOnSessionRepository.save(session);
            response.setSessionId(session.getId());
            
            return response;
            
        } catch (Exception e) {
            return new VirtualTryOnResponse(false, "Virtual try-on failed: " + e.getMessage());
        }
    }

    public VirtualTryOnResponse getSessionResult(UUID sessionId) {
        UUID tenantId = TenantContext.getCurrentTenant();
        
        TryOnSession session = tryOnSessionRepository.findByIdAndTenantId(sessionId, tenantId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        VirtualTryOnResponse response = new VirtualTryOnResponse();
        response.setSessionId(session.getId());
        response.setResultImageUrl(session.getResultImageUrl());
        response.setAvatarWithClothingUrl(session.getAvatarWithClothingUrl());
        response.setConfidenceScore(session.getConfidenceScore());
        response.setFitFeedback(session.getFitFeedback());
        response.setSuccess(true);
        
        return response;
    }
}