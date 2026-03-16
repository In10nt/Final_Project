package com.virtualtryonsaas.repository;

import com.virtualtryonsaas.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByTenantIdAndEmail(UUID tenantId, String email);
    
    boolean existsByTenantIdAndEmail(UUID tenantId, String email);
    
    Optional<User> findByEmail(String email);
    
    Page<User> findByTenantId(UUID tenantId, Pageable pageable);
    
    long countByTenantId(UUID tenantId);
}