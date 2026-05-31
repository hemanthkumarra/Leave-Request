package com.company.leaverequest.controller;

import com.company.leaverequest.config.JwtUtils;
import com.company.leaverequest.dto.AuthRequest;
import com.company.leaverequest.dto.AuthResponse;
import com.company.leaverequest.dto.SignupRequest;
import com.company.leaverequest.dto.ProfileUpdateRequest;
import com.company.leaverequest.model.Role;
import com.company.leaverequest.model.User;
import com.company.leaverequest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Parse role
        Role userRole = Role.EMPLOYEE;
        if (signupRequest.getRole() != null) {
            try {
                userRole = Role.valueOf(signupRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Error: Invalid Role type. Supported roles: EMPLOYEE, HR");
            }
        }

        // Create new user's account
        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(userRole)
                .phoneNumber(signupRequest.getPhoneNumber())
                .build();

        userRepository.save(user);

        // Generate JWT token upon successful registration
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsernameOrEmail(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Retrieve authenticated user details
        String principalUsername = authentication.getName();
        User user = userRepository.findByUsername(principalUsername)
                .orElseGet(() -> userRepository.findByEmail(principalUsername)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database.")));

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .build());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Error: Unauthorized access.");
        }
        String currentUsername = authentication.getName();
        User user = userRepository.findByUsername(currentUsername)
                .orElseGet(() -> userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Error: User not found.")));
        
        return ResponseEntity.ok(AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(Authentication authentication, @RequestBody ProfileUpdateRequest profileRequest) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Error: Unauthorized access.");
        }
        String currentUsername = authentication.getName();
        User user = userRepository.findByUsername(currentUsername)
                .orElseGet(() -> userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Error: User not found.")));

        // Validate uniqueness of username if changing
        if (!user.getUsername().equals(profileRequest.getUsername())) {
            if (userRepository.existsByUsername(profileRequest.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            user.setUsername(profileRequest.getUsername());
        }

        // Validate uniqueness of email if changing
        if (!user.getEmail().equals(profileRequest.getEmail())) {
            if (userRepository.existsByEmail(profileRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }
            user.setEmail(profileRequest.getEmail());
        }

        // Update other fields
        user.setPhoneNumber(profileRequest.getPhoneNumber());

        // Update password if a new one is supplied
        if (profileRequest.getNewPassword() != null && !profileRequest.getNewPassword().trim().isEmpty()) {
            if (profileRequest.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Error: Password must be at least 6 characters long.");
            }
            user.setPassword(passwordEncoder.encode(profileRequest.getNewPassword()));
        }

        userRepository.save(user);

        // Re-generate JWT token with the new username/email claims
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .build());
    }
}
