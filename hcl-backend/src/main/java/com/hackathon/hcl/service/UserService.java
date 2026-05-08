package com.hackathon.hcl.service;

import com.hackathon.hcl.DTO.UserRequestDTO;
import com.hackathon.hcl.DTO.UserResponseDTO;
import com.hackathon.hcl.exception.BadRequestException;
import com.hackathon.hcl.exception.ResourceNotFoundException;
import com.hackathon.hcl.model.User;
import com.hackathon.hcl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(String authorizationHeader) {
        return toUserResponse(getUserFromToken(authorizationHeader));
    }

    @Transactional
    public UserResponseDTO updateUserProfile(String authorizationHeader, UserRequestDTO request) {
        User user = getUserFromToken(authorizationHeader);

        userRepository.findByEmail(request.getEmail())
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new BadRequestException("Email is already registered");
                });

        if (!user.getPhone().equals(request.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone is already registered");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(request.getRole().toUpperCase());
        }

        return toUserResponse(userRepository.save(user));
    }

    private User getUserFromToken(String authorizationHeader) {
        Integer userId = jwtService.extractUserId(authorizationHeader);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
}
