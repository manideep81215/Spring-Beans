package com.hackathon.hcl.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequestDTO {

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must be at most 255 characters")
    @JsonAlias({"deliveryAddress", "delivery_address"})
    private String address;
}
