-- Fix body_profiles table to support UUID tenant_id
USE virtual_tryon;

-- Drop the table and recreate with correct column types
DROP TABLE IF EXISTS body_profiles;

CREATE TABLE body_profiles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    tenant_id CHAR(36) NOT NULL,
    height_cm INT,
    weight_kg DOUBLE,
    chest_cm DOUBLE,
    waist_cm DOUBLE,
    hip_cm DOUBLE,
    shoulder_width_cm DOUBLE,
    body_shape VARCHAR(50),
    skin_tone VARCHAR(50),
    gender VARCHAR(20),
    nickname VARCHAR(100),
    age INT,
    hair_color VARCHAR(50),
    eye_color VARCHAR(50),
    profile_image_url TEXT,
    face_image_url TEXT,
    avatar_model_url TEXT,
    body_landmarks JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_tenant (user_id, tenant_id),
    INDEX idx_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
