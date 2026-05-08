package com.hackathon.hcl.service;

import com.hackathon.hcl.DTO.MenuItemResponseDTO;
import com.hackathon.hcl.DTO.MenuItemRequestDTO;
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

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    @Transactional(readOnly = true)
    public MenuItemResponseDTO getMenuItemById(Integer menuItemId) {
        return toMenuItemResponse(findMenuItem(menuItemId));
    }

    @Transactional
    public MenuItemResponseDTO createMenuItem(MenuItemRequestDTO request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        MenuItem menuItem = new MenuItem();
        menuItem.setRestaurant(restaurant);
        menuItem.setName(request.getName());
        menuItem.setCategory(request.getCategory());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageData(request.getImageData());
        menuItem.setImageContentType(request.getImageContentType());
        menuItem.setAvailable(request.getAvailable());

        return toMenuItemResponse(menuItemRepository.save(menuItem));
    }

    @Transactional
    public MenuItemResponseDTO uploadImage(Integer menuItemId, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }
        if (image.getContentType() == null || !image.getContentType().startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        MenuItem menuItem = findMenuItem(menuItemId);
        try {
            menuItem.setImageData(image.getBytes());
            menuItem.setImageContentType(image.getContentType());
        } catch (IOException ex) {
            throw new BadRequestException("Could not read uploaded image");
        }

        return toMenuItemResponse(menuItemRepository.save(menuItem));
    }

    @Transactional(readOnly = true)
    public MenuItem getMenuItemImage(Integer menuItemId) {
        MenuItem menuItem = findMenuItem(menuItemId);
        if (menuItem.getImageData() == null || menuItem.getImageData().length == 0) {
            throw new ResourceNotFoundException("Menu item image not found");
        }
        return menuItem;
    }

    private MenuItem findMenuItem(Integer menuItemId) {
        return menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
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
