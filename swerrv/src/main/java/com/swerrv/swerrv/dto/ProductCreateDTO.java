package com.swerrv.swerrv.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String category;

    private String description;
    private String material;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    private BigDecimal salePrice;

    private List<String> images;
    private List<String> sizes;
    private List<String> colors;

    @PositiveOrZero
    private Integer stock = 0;

    private boolean featured = false;
    private boolean isNew = false;
    private boolean comingSoon = false;
}
