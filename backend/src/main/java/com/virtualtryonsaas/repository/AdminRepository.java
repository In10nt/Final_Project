package com.virtualtryonsaas.repository;

import com.virtualtryonsaas.entity.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {
    
    Optional<Admin> findByTenantIdAndEmail(UUID tenantId, String email);
    
    boolean existsByTenantIdAndEmail(UUID tenantId, String email);
    
    Optional<Admin> findByEmail(String email);
    
    Page<Admin> findByTenantId(UUID tenantId, Pageable pageable);
    
    long countByTenantId(UUID tenantId);
}