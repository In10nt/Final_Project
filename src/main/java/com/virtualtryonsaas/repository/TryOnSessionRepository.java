package com.virtualtryonsaas.repository;

import com.virtualtryonsaas.entity.TryOnSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TryOnSessionRepository extends JpaRepository<TryOnSession, UUID> {
    
    Optional<TryOnSession> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Page<TryOnSession> findByTenantId(UUID tenantId, Pageable pageable);
    
    List<TryOnSession> findByUserIdAndTenantIdOrderByCreatedAtDesc(UUID userId, UUID tenantId);
    
    Page<TryOnSession> findByUserIdAndTenantId(UUID userId, UUID tenantId, Pageable pageable);
    
    long countByTenantId(UUID tenantId);
    
    long countByUserIdAndTenantId(UUID userId, UUID tenantId);
}