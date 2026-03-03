package com.swerrv.swerrv.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddToCartRequest {
    @NotNull
    private Long productId;

    @Positive
    private Integer quantity = 1;

    private String size;
    private String color;
}
