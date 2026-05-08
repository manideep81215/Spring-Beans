package com.hackathon.hcl.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponseDTO {

    private Integer id;
    private Integer restaurantId;
    private String restaurantName;
    private String name;
    private String category;
    private BigDecimal price;
    private byte[] imageData;
    private String imageContentType;
    private Boolean available;
}
