package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.DashboardMetricsDto;
import com.virtualtryonsaas.repository.ProductRepository;
import com.virtualtryonsaas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardMetricsDto getDashboardMetrics() {
        long totalCustomers = userRepository.count();
        long totalProducts = productRepository.count();
        
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