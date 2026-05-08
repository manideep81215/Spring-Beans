package com.hackathon.hcl.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequestDTO {

    @NotBlank(message = "Order status is required")
    @Pattern(
            regexp = "^(PLACED|CONFIRMED|PREPARING|OUT_FOR_DELIVERY|DELIVERED|CANCELLED)$",
            message = "Status must be PLACED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, or CANCELLED")
    private String status;
}
