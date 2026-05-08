package com.hackathon.hcl.controller;

import com.hackathon.hcl.DTO.MenuItemRequestDTO;
import com.hackathon.hcl.DTO.MenuItemResponseDTO;
import com.hackathon.hcl.DTO.OrderResponseDTO;
import com.hackathon.hcl.DTO.OrderStatusUpdateRequestDTO;
import com.hackathon.hcl.DTO.RestaurantRequestDTO;
import com.hackathon.hcl.DTO.RestaurantResponseDTO;
import com.hackathon.hcl.service.MenuItemService;
import com.hackathon.hcl.service.OrderService;
import com.hackathon.hcl.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MenuItemService menuItemService;
    private final RestaurantService restaurantService;
    private final OrderService orderService;

    @PostMapping("/restaurants")
    public ResponseEntity<RestaurantResponseDTO> createRestaurant(
            @Valid @RequestBody RestaurantRequestDTO request) {
        return ResponseEntity.ok(restaurantService.createRestaurant(request));
    }

    @PostMapping("/menu-items")
    public ResponseEntity<MenuItemResponseDTO> createMenuItem(
            @Valid @RequestBody MenuItemRequestDTO request) {
        return ResponseEntity.ok(menuItemService.createMenuItem(request));
    }

    @PutMapping(value = "/menu-items/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemResponseDTO> uploadOrReplaceMenuItemImage(
            @PathVariable Integer id,
            @RequestPart("image") MultipartFile image) {
        return ResponseEntity.ok(menuItemService.uploadImage(id, image));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Integer id,
            @Valid @RequestBody OrderStatusUpdateRequestDTO request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}
