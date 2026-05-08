package com.hackathon.hcl.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {

    private Integer id;
    private Integer userId;
    private String userName;
    private BigDecimal totalAmount;
    private LocalDateTime updatedAt;
    private List<CartItemResponseDTO> cartItems;
}
