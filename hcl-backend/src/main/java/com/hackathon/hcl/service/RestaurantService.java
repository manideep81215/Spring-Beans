package com.hackathon.hcl.service;

import com.hackathon.hcl.DTO.MenuItemResponseDTO;
import com.hackathon.hcl.DTO.RestaurantRequestDTO;
import com.hackathon.hcl.DTO.RestaurantResponseDTO;
import com.hackathon.hcl.exception.BadRequestException;
import com.hackathon.hcl.exception.ResourceNotFoundException;
import com.hackathon.hcl.model.MenuItem;
import com.hackathon.hcl.model.Restaurant;
import com.hackathon.hcl.repository.MenuItemRepository;
import com.hackathon.hcl.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public List<RestaurantResponseDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(restaurant -> toRestaurantResponse(restaurant, true))
                .toList();
    }

    @Transactional(readOnly = true)
    public RestaurantResponseDTO getRestaurantById(Integer id) {
        Restaurant restaurant = findRestaurant(id);
        return toRestaurantResponse(restaurant, true);
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponseDTO> getRestaurantMenu(Integer id) {
        if (!restaurantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Restaurant not found");
        }
        return menuItemRepository.findByRestaurantId(id).stream()
                .map(this::toMenuItemResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponseDTO> searchRestaurants(String query) {
        return restaurantRepository
                .searchByRestaurantCuisineOrMenuItem(query)
                .stream()
                .map(restaurant -> toRestaurantResponse(restaurant, true))
                .toList();
    }

    @Transactional
    public RestaurantResponseDTO createRestaurant(RestaurantRequestDTO request) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setAddress(request.getAddress());
        restaurant.setRating(request.getRating());
        restaurant.setOpen(request.getOpen());

        return toRestaurantResponse(restaurantRepository.save(restaurant), true);
    }

    @Transactional
    public RestaurantResponseDTO uploadImage(Integer restaurantId, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }
        if (image.getContentType() == null || !image.getContentType().startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        Restaurant restaurant = findRestaurant(restaurantId);
        try {
            restaurant.setImageData(image.getBytes());
            restaurant.setImageContentType(image.getContentType());
        } catch (IOException ex) {
            throw new BadRequestException("Could not read uploaded image");
        }

        return toRestaurantResponse(restaurantRepository.save(restaurant), true);
    }

    @Transactional(readOnly = true)
    public Restaurant getRestaurantImage(Integer restaurantId) {
        Restaurant restaurant = findRestaurant(restaurantId);
        if (restaurant.getImageData() == null || restaurant.getImageData().length == 0) {
            throw new ResourceNotFoundException("Restaurant image not found");
        }
        return restaurant;
    }

    private Restaurant findRestaurant(Integer id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    private RestaurantResponseDTO toRestaurantResponse(Restaurant restaurant, boolean includeMenuItems) {
        List<MenuItemResponseDTO> menuItems = includeMenuItems
                ? menuItemRepository.findByRestaurantId(restaurant.getId()).stream()
                .map(this::toMenuItemResponse)
                .toList()
                : List.of();

        return new RestaurantResponseDTO(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getCuisine(),
                restaurant.getAddress(),
                restaurant.getRating(),
                restaurant.getOpen(),
                restaurant.getImageData(),
                restaurant.getImageContentType(),
                menuItems);
    }

    private MenuItemResponseDTO toMenuItemResponse(MenuItem menuItem) {
        return new MenuItemResponseDTO(
                menuItem.getId(),
                menuItem.getRestaurant().getId(),
                menuItem.getRestaurant().getName(),
                menuItem.getName(),
                menuItem.getCategory(),
                menuItem.getPrice(),
                menuItem.getImageData(),
                menuItem.getImageContentType(),
                menuItem.getAvailable());
    }
}
