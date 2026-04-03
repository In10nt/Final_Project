package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.AvatarCustomizationRequest;
import com.virtualtryonsaas.dto.AvatarResponse;
import com.virtualtryonsaas.entity.BodyProfile;
import com.virtualtryonsaas.repository.BodyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AvatarGenerationService {

    @Autowired
    private BodyProfileRepository bodyProfileRepository;

    public AvatarResponse generateAvatar(UUID userId, AvatarCustomizationRequest customization) {
        // Get body profile
        BodyProfile profile = bodyProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Body profile not found. Please create your body profile first."));

        // Calculate body proportions from measurements
        Map<String, Object> proportions = calculateBodyProportions(profile);
        
        // Generate Ready Player Me avatar URL
        String avatarUrl = generateReadyPlayerMeAvatar(profile, customization, proportions);
        
        // Generate avatar configuration
        String avatarConfig = generateAvatarConfiguration(profile, customization, proportions);
        
        // Update body profile with avatar info
        profile.setSkinTone(customization.getSkinTone());
        profile.setHairColor(customization.getHairColor());
        profile.setEyeColor(customization.getEyeColor());
        profile.setBodyShape(customization.getBodyShape());
        profile.setAvatarModelUrl(avatarUrl);
        bodyProfileRepository.save(profile);
        
        return new AvatarResponse(
            avatarUrl,
            avatarUrl,
            proportions.toString(),
            avatarConfig
        );
    }

    private String generateReadyPlayerMeAvatar(BodyProfile profile, AvatarCustomizationRequest customization, Map<String, Object> proportions) {
        // For now, use an existing OBJ model as a placeholder
        // TODO: Convert FBX mannequin to OBJ or GLB format
        return "http://localhost:8082/uploads/models/suit.obj";
    }

    private Map<String, Object> calculateBodyProportions(BodyProfile profile) {
        Map<String, Object> proportions = new HashMap<>();
        
        // Calculate relative proportions (normalized to 0-1 scale)
        double height = profile.getHeightCm() != null ? profile.getHeightCm() : 170.0;
        double chest = profile.getChestCm() != null ? profile.getChestCm() : 90.0;
        double waist = profile.getWaistCm() != null ? profile.getWaistCm() : 75.0;
        double hip = profile.getHipCm() != null ? profile.getHipCm() : 95.0;
        double shoulder = profile.getShoulderWidthCm() != null ? profile.getShoulderWidthCm() : 45.0;
        
        // Normalize to standard ranges for 3D model scaling
        proportions.put("height", normalizeHeight(height));
        proportions.put("chestWidth", normalizeChest(chest));
        proportions.put("waistWidth", normalizeWaist(waist));
        proportions.put("hipWidth", normalizeHip(hip));
        proportions.put("shoulderWidth", normalizeShoulder(shoulder));
        
        // Calculate body shape
        String bodyShape = determineBodyShape(chest, waist, hip);
        proportions.put("bodyShape", bodyShape);
        
        return proportions;
    }

    private double normalizeHeight(double height) {
        return 0.5 + ((height - 150) / 50.0);
    }

    private double normalizeChest(double chest) {
        return 0.7 + ((chest - 70) / 50.0) * 0.6;
    }

    private double normalizeWaist(double waist) {
        return 0.6 + ((waist - 60) / 50.0) * 0.8;
    }

    private double normalizeHip(double hip) {
        return 0.8 + ((hip - 80) / 50.0) * 0.5;
    }

    private double normalizeShoulder(double shoulder) {
        return 0.8 + ((shoulder - 35) / 20.0) * 0.4;
    }

    private String determineBodyShape(double chest, double waist, double hip) {
        double chestWaistRatio = chest / waist;
        double hipWaistRatio = hip / waist;
        
        if (Math.abs(chest - hip) < 5 && chestWaistRatio > 1.2) {
            return "hourglass";
        } else if (chest > hip + 5) {
            return "triangle";
        } else if (hip > chest + 5) {
            return "pear";
        } else if (chestWaistRatio < 1.1 && hipWaistRatio < 1.1) {
            return "rectangle";
        } else {
            return "athletic";
        }
    }

    private String generateAvatarConfiguration(BodyProfile profile, AvatarCustomizationRequest customization, Map<String, Object> proportions) {
        StringBuilder config = new StringBuilder();
        config.append("{");
        config.append("\"bodyProportions\": ").append(proportions.toString().replace("=", ":")).append(",");
        config.append("\"skinTone\": \"").append(customization.getSkinTone() != null ? customization.getSkinTone() : "medium").append("\",");
        config.append("\"hairColor\": \"").append(customization.getHairColor() != null ? customization.getHairColor() : "brown").append("\",");
        config.append("\"hairStyle\": \"").append(customization.getHairStyle() != null ? customization.getHairStyle() : "short").append("\",");
        config.append("\"eyeColor\": \"").append(customization.getEyeColor() != null ? customization.getEyeColor() : "brown").append("\",");
        config.append("\"gender\": \"").append(profile.getGender() != null ? profile.getGender() : "neutral").append("\"");
        config.append("}");
        
        return config.toString();
    }
}
