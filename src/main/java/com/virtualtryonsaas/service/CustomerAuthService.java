package com.virtualtryonsaas.service;

import com.virtualtryonsaas.dto.CustomerDto;
import com.virtualtryonsaas.dto.CustomerLoginRequest;
import com.virtualtryonsaas.dto.CustomerRegisterRequest;
import com.virtualtryonsaas.dto.LoginResponse;
import com.virtualtryonsaas.entity.User;
import com.virtualtryonsaas.repository.UserRepository;
import com.virtualtryonsaas.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomerAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public LoginResponse register(CustomerRegisterRequest request) {
        try {
            System.out.println("Registration attempt for email: " + request.getEmail());
            
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already registered");
            }

            // Create new customer user
            User customer = new User();
            customer.setId(UUID.randomUUID());
            customer.setEmail(request.getEmail());
            customer.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setPhone(request.getPhone());
            customer.setUserType("CUSTOMER");
            customer.setStatus("ACTIVE");

            System.out.println("Saving customer to database...");
            customer = userRepository.save(customer);
            System.out.println("Customer saved with ID: " + customer.getId());

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(
                customer.getId(),
                "CUSTOMER",
                customer.getEmail()
            );

            // Create response
            CustomerDto customerDto = convertToDto(customer);
            return new LoginResponse(token, customerDto);
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    public LoginResponse login(CustomerLoginRequest request) {
        // Find user by email
        User customer = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify user is a customer
        if (!"CUSTOMER".equals(customer.getUserType())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), customer.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
            customer.getId(),
            "CUSTOMER",
            customer.getEmail()
        );

        // Create response
        CustomerDto customerDto = convertToDto(customer);
        return new LoginResponse(token, customerDto);
    }

    private CustomerDto convertToDto(User user) {
        CustomerDto dto = new CustomerDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setTryOnCount(0);
        dto.setAverageRating(0.0);
        return dto;
    }
}
