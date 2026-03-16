package com.virtualtryonsaas.controller;

import com.virtualtryonsaas.dto.LoginRequest;
import com.virtualtryonsaas.dto.LoginResponse;
import com.virtualtryonsaas.dto.RegisterRequest;
import com.virtualtryonsaas.entity.User;
import com.virtualtryonsaas.repository.UserRepository;
import com.virtualtryonsaas.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.registerUser(registerRequest);
        return ResponseEntity.ok().body("User registered successfully");
    }

    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> adminLogin(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticateAdmin(loginRequest);
        return ResponseEntity.ok(response);
    }
}