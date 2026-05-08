package com.hackathon.hcl.controller;

import com.hackathon.hcl.DTO.UserRequestDTO;
import com.hackathon.hcl.DTO.UserResponseDTO;
import com.hackathon.hcl.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getUserProfile(
            @RequestHeader("Authorization") String authorizationHeader) {
        return ResponseEntity.ok(userService.getUserProfile(authorizationHeader));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDTO> updateUserProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.updateUserProfile(authorizationHeader, request));
    }
}
