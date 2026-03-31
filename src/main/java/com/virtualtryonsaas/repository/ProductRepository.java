package com.virtualtryonsaas.repository;

import com.virtualtryonsaas.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    Page<Product> findByTenantId(UUID tenantId, Pageable pageable);
    
    Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Optional<Product> findByBarcodeAndTenantId(String barcode, UUID tenantId);
    
    Optional<Product> findBySkuAndTenantId(String sku, UUID tenantId);
    
    boolean existsByBarcodeAndTenantId(String barcode, UUID tenantId);
    
    boolean existsBySkuAndTenantId(String sku, UUID tenantId);
    
    long countByTenantId(UUID tenantId);
}