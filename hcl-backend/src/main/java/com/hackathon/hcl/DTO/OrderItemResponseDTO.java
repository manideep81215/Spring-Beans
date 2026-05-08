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
public class OrderItemResponseDTO {

    private Integer id;
    private Integer orderId;
    private Integer menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal price;
}
