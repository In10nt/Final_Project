package com.virtualtryonsaas.repository;

import com.virtualtryonsaas.entity.BodyProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BodyProfileRepository extends JpaRepository<BodyProfile, UUID> {
    
    Optional<BodyProfile> findByUserIdAndTenantId(UUID userId, UUID tenantId);
    
    Optional<BodyProfile> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Page<BodyProfile> findByTenantId(UUID tenantId, Pageable pageable);
    
    boolean existsByUserIdAndTenantId(UUID userId, UUID tenantId);
    
    long countByTenantId(UUID tenantId);
}