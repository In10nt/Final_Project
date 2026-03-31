package com.virtualtryonsaas.entity;

import com.virtualtryonsaas.config.UUIDStringConverter;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "barcode"}),
    @UniqueConstraint(columnNames = {"tenant_id", "sku"})
})
@EntityListeners(AuditingEntityListener.class)
public class Product {
    
    @Id
    @Convert(converter = UUIDStringConverter.class)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;
    
    @Convert(converter = UUIDStringConverter.class)
    @Column(name = "tenant_id", nullable = false, columnDefinition = "CHAR(36)")
    private UUID tenantId;
    
    @Convert(converter = UUIDStringConverter.class)
    @Column(name = "category_id", columnDefinition = "CHAR(36)")
    private UUID categoryId;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    private String brand;
    
    private BigDecimal price;
    
    private String currency = "USD";
    
    private String barcode;
    
    private String sku;
    
    private String color;
    
    private String material;
    
    @Column(name = "care_instructions")
    private String careInstructions;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "model3d_url")
    private String model3dUrl;
    
    private String status = "active";
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // Constructors
    public Product() {}

    public Product(UUID tenantId, String name, String barcode) {
        this.tenantId = tenantId;
        this.name = name;
        this.barcode = barcode;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getModel3dUrl() { return model3dUrl; }
    public void setModel3dUrl(String model3dUrl) { this.model3dUrl = model3dUrl; }
}