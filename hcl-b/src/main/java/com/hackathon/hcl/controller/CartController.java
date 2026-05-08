package com.hackathon.hcl.controller;

import com.hackathon.hcl.DTO.CartItemRequestDTO;
import com.hackathon.hcl.DTO.CartResponseDTO;
import com.hackathon.hcl.DTO.QuantityUpdateRequestDTO;
import com.hackathon.hcl.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCurrentUserCart(
            @RequestHeader("Authorization") String authorizationHeader) {
        return ResponseEntity.ok(cartService.getCurrentUserCart(authorizationHeader));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CartItemRequestDTO request) {
        return ResponseEntity.ok(cartService.addItemToCart(authorizationHeader, request));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartResponseDTO> updateCartItemQuantity(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer itemId,
            @Valid @RequestBody QuantityUpdateRequestDTO request) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(authorizationHeader, itemId, request));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartResponseDTO> removeItemFromCart(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer itemId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(authorizationHeader, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestHeader("Authorization") String authorizationHeader) {
        cartService.clearCart(authorizationHeader);
        return ResponseEntity.noContent().build();
    }
}
