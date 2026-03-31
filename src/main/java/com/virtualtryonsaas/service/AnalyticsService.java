package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.DashboardMetricsDto;
import com.virtualtryonsaas.repository.ProductRepository;
import com.virtualtryonsaas.repository.UserRepository;
import com.virtualtryonsaas.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardMetricsDto getDashboardMetrics() {
        UUID tenantId = TenantContext.getCurrentTenant();
        
        long totalCustomers = userRepository.countByTenantId(tenantId);
        long totalProducts = productRepository.countByTenantId(tenantId);
        
        DashboardMetricsDto metrics = new DashboardMetricsDto();
        metrics.setTotalCustomers(totalCustomers);
        metrics.setTotalProducts(totalProducts);
        metrics.setTotalTryOns(8750);
        metrics.setConversionRate(12.5);
        metrics.setAverageRating(4.8);
        metrics.setNewCustomersThisMonth(45);
        
        return metrics;
    }
}
