package com.hackathon.hcl.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponseDTO {

    private Integer id;
    private String name;
    private String cuisine;
    private String address;
    private Double rating;
    
    private Boolean open;
    private String dish;
    private byte[] imageData;
    private String imageContentType;
    private List<MenuItemResponseDTO> menuItems;
}
