package com.hackathon.hcl.service;

import com.hackathon.hcl.DTO.AuthResponseDTO;
import com.hackathon.hcl.DTO.LoginRequestDTO;
import com.hackathon.hcl.DTO.UserRequestDTO;
import com.hackathon.hcl.DTO.UserResponseDTO;
import com.hackathon.hcl.exception.BadRequestException;
import com.hackathon.hcl.model.User;
import com.hackathon.hcl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailNotificationService emailNotificationService;

    @Transactional
    public AuthResponseDTO register(UserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone is already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(normalizeRole(request.getRole()));

        User savedUser = userRepository.save(user);
        emailNotificationService.sendRegistrationConfirmation(savedUser);
        String token = jwtService.generateToken(savedUser);
        return new AuthResponseDTO(token, "Bearer", toUserResponse(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponseDTO(token, "Bearer", toUserResponse(user));
    }

    public void logout(String authorizationHeader) {
        jwtService.invalidateToken(authorizationHeader);
    }

    private UserResponseDTO toUserResponse(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt());
    }

    private String normalizeRole(String role) {
        return role == null || role.isBlank() ? "CUSTOMER" : role.toUpperCase();
    }
}
