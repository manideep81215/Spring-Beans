package com.hackathon.hcl.controller;

import com.hackathon.hcl.DTO.MenuItemResponseDTO;
import com.hackathon.hcl.DTO.RestaurantResponseDTO;
import com.hackathon.hcl.model.Restaurant;
import com.hackathon.hcl.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurantById(@PathVariable Integer id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<List<MenuItemResponseDTO>> getRestaurantMenu(@PathVariable Integer id) {
        return ResponseEntity.ok(restaurantService.getRestaurantMenu(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RestaurantResponseDTO>> searchRestaurants(@RequestParam String q) {
        return ResponseEntity.ok(restaurantService.searchRestaurants(q));
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RestaurantResponseDTO> uploadImage(
            @PathVariable Integer id,
            @RequestPart("image") MultipartFile image) {
        return ResponseEntity.ok(restaurantService.uploadImage(id, image));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        Restaurant restaurant = restaurantService.getRestaurantImage(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(restaurant.getImageContentType()))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(restaurant.getImageData());
    }
}
