package com.virtualtryonsaas.controller;

import com.virtualtryonsaas.dto.DashboardMetricsDto;
import com.virtualtryonsaas.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardMetricsDto> getDashboardMetrics() {
        DashboardMetricsDto metrics = analyticsService.getDashboardMetrics();
        return ResponseEntity.ok(metrics);
    }
}
