package com.virtualtryonsaas.tenant;

import com.virtualtryonsaas.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = jwtTokenProvider.resolveToken(request);
        
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String tenantId = jwtTokenProvider.getTenantId(token);
            if (tenantId != null) {
                TenantContext.setCurrentTenant(UUID.fromString(tenantId));
            }
        }
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) {
        TenantContext.clear();
    }
}