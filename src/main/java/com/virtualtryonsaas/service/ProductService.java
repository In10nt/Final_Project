package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.ProductDto;
import com.virtualtryonsaas.dto.ProductRequest;
import com.virtualtryonsaas.entity.Product;
import com.virtualtryonsaas.repository.ProductRepository;
import com.virtualtryonsaas.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<ProductDto> getAllProducts(Pageable pageable) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Page<Product> products;
        
        if (tenantId != null) {
            // Admin access - filter by tenant
            products = productRepository.findByTenantId(tenantId, pageable);
        } else {
            // Public/Customer access - show all products
            products = productRepository.findAll(pageable);
        }
        
        return products.map(this::convertToDto);
    }

    public ProductDto getProductById(UUID id) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDto(product);
    }

    public ProductDto getProductByBarcode(String barcode) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Product product = productRepository.findByBarcodeAndTenantId(barcode, tenantId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDto(product);
    }

    public ProductDto createProduct(ProductRequest request) {
        UUID tenantId = TenantContext.getCurrentTenant();
        
        Product product = new Product();
        product.setTenantId(tenantId);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setBarcode(request.getBarcode());
        product.setSku(request.getSku());
        product.setColor(request.getColor());
        product.setMaterial(request.getMaterial());
        product.setCategoryId(request.getCategoryId());

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public ProductDto updateProduct(UUID id, ProductRequest request) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setColor(request.getColor());
        product.setMaterial(request.getMaterial());

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public void deleteProduct(UUID id) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPrice());
        dto.setCurrency(product.getCurrency());
        dto.setBarcode(product.getBarcode());
        dto.setSku(product.getSku());
        dto.setColor(product.getColor());
        dto.setMaterial(product.getMaterial());
        dto.setStatus(product.getStatus());
        return dto;
    }
}