package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.LoginRequest;
import com.virtualtryonsaas.dto.LoginResponse;
import com.virtualtryonsaas.dto.RegisterRequest;
import com.virtualtryonsaas.entity.Admin;
import com.virtualtryonsaas.entity.User;
import com.virtualtryonsaas.repository.AdminRepository;
import com.virtualtryonsaas.repository.UserRepository;
import com.virtualtryonsaas.security.JwtTokenProvider;
import com.virtualtryonsaas.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(authentication, userPrincipal.getTenantId(), "customer");

        return new LoginResponse(
            jwt,
            userPrincipal.getId(),
            userPrincipal.getEmail(),
            "", // firstName - to be implemented
            "", // lastName - to be implemented
            userPrincipal.getTenantId()
        );
    }

    public LoginResponse authenticateAdmin(LoginRequest loginRequest) {
        // First try to find admin
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        
        if (admin != null) {
            // Update last login
            admin.setLastLoginAt(LocalDateTime.now());
            adminRepository.save(admin);
            
            // Create authorities with ADMIN role
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            // Create UserPrincipal with admin authorities
            UserPrincipal userPrincipal = new UserPrincipal(
                admin.getId(),
                admin.getEmail(),
                admin.getPasswordHash(),
                admin.getTenantId(),
                "admin",
                authorities
            );
            
            // Create authentication token
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                authorities
            );
            
            // Generate JWT with admin role
            String jwt = tokenProvider.generateToken(authentication, admin.getTenantId(), "admin");
            
            return new LoginResponse(
                jwt,
                admin.getId(),
                admin.getEmail(),
                admin.getFirstName() != null ? admin.getFirstName() : "Admin",
                admin.getLastName() != null ? admin.getLastName() : "User",
                admin.getTenantId()
            );
        }
        
        // Fallback to user table for demo purposes
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        // Create authorities with ADMIN role
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        
        // Create UserPrincipal with admin authorities
        UserPrincipal userPrincipal = new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPasswordHash(),
            user.getTenantId(),
            "admin",
            authorities
        );
        
        // Create authentication token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal,
            null,
            authorities
        );
        
        // Generate JWT with admin role
        String jwt = tokenProvider.generateToken(authentication, user.getTenantId(), "admin");
        
        return new LoginResponse(
            jwt,
            user.getId(),
            user.getEmail(),
            user.getFirstName() != null ? user.getFirstName() : "Admin",
            user.getLastName() != null ? user.getLastName() : "User",
            user.getTenantId()
        );
    }

    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByTenantIdAndEmail(registerRequest.getTenantId(), registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists for this tenant");
        }

        User user = new User();
        user.setTenantId(registerRequest.getTenantId());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());

        userRepository.save(user);
    }

    public void createAdmin(UUID tenantId, String email, String password, String firstName, String lastName) {
        if (adminRepository.existsByTenantIdAndEmail(tenantId, email)) {
            throw new RuntimeException("Admin email already exists for this tenant");
        }

        Admin admin = new Admin();
        admin.setTenantId(tenantId);
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setRole("admin");

        adminRepository.save(admin);
    }
}