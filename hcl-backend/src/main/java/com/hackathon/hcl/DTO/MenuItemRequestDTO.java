package com.hackathon.hcl.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequestDTO {

    @NotNull(message = "Restaurant id is required")
    private Integer restaurantId;

    @NotBlank(message = "Menu item name is required")
    @Size(max = 100, message = "Menu item name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 60, message = "Category must be at most 60 characters")
    private String category;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price cannot be negative")
    private BigDecimal price;

    private byte[] imageData;

    @Size(max = 100, message = "Image content type must be at most 100 characters")
    private String imageContentType;

    @NotNull(message = "Availability is required")
    private Boolean available;
}
