package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.LoginRequest;
import com.virtualtryonsaas.dto.LoginResponse;
import com.virtualtryonsaas.dto.RegisterRequest;
import com.virtualtryonsaas.entity.User;
import com.virtualtryonsaas.repository.UserRepository;
import com.virtualtryonsaas.security.JwtTokenProvider;
import com.virtualtryonsaas.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

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
        // Similar to authenticateUser but for admin users
        // Implementation would check admin table instead
        throw new UnsupportedOperationException("Admin authentication not yet implemented");
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
}