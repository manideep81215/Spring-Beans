package com.hackathon.hcl.controller;

import com.hackathon.hcl.DTO.MenuItemResponseDTO;
import com.hackathon.hcl.model.MenuItem;
import com.hackathon.hcl.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponseDTO> getMenuItemById(@PathVariable Integer id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemResponseDTO> uploadImage(
            @PathVariable Integer id,
            @RequestPart("image") MultipartFile image) {
        return ResponseEntity.ok(menuItemService.uploadImage(id, image));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        MenuItem menuItem = menuItemService.getMenuItemImage(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(menuItem.getImageContentType()))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(menuItem.getImageData());
    }
}
