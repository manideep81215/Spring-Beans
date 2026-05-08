package com.hackathon.hcl.DTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequestDTO {

    @NotBlank(message = "Restaurant name is required")
    @Size(max = 100, message = "Restaurant name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Cuisine is required")
    @Size(max = 60, message = "Cuisine must be at most 60 characters")
    private String cuisine;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must be at most 255 characters")
    private String address;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating cannot be less than 0")
    @DecimalMax(value = "5.0", message = "Rating cannot be greater than 5")
    private Double rating;

    @NotNull(message = "Open status is required")
    private Boolean open;
}
