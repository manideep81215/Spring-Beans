package com.hackathon.hcl.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    @NotNull(message = "User id is required")
    private Integer userId;

    @NotBlank(message = "Order status is required")
    @Size(max = 30, message = "Order status must be at most 30 characters")
    private String status;

    @NotNull(message = "Total amount is required")
    @PositiveOrZero(message = "Total amount cannot be negative")
    private BigDecimal totalAmount;

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must be at most 255 characters")
    private String address;

    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequestDTO> orderItems;
}
