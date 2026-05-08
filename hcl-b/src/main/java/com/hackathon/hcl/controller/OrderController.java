package com.hackathon.hcl.controller;

import com.hackathon.hcl.DTO.OrderResponseDTO;
import com.hackathon.hcl.DTO.PlaceOrderRequestDTO;
import com.hackathon.hcl.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<OrderResponseDTO> placeOrderFromCart(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody PlaceOrderRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrderFromCart(authorizationHeader, request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrderResponseDTO>> getOrderHistory(
            @RequestHeader("Authorization") String authorizationHeader) {
        return ResponseEntity.ok(orderService.getOrderHistory(authorizationHeader));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(authorizationHeader, id));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> getOrderStatus(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer id) {
        return ResponseEntity.ok(Map.of("status", orderService.getOrderStatus(authorizationHeader, id)));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<OrderResponseDTO> cancelOrder(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer id) {
        return ResponseEntity.ok(orderService.cancelOrder(authorizationHeader, id));
    }
}
