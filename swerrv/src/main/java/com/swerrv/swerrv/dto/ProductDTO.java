package com.swerrv.swerrv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    // Core identity
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String material;
    private String category;

    // Pricing — named to match frontend convention
    private BigDecimal price; // the current/sale price (what you pay)
    private BigDecimal originalPrice; // the crossed-out original price

    // Media — single shortcut + full list
    private String image; // images[0] shortcut
    private List<String> images;

    // Variants
    private List<String> sizes;
    private List<String> colors;

    // Inventory
    private Integer stock;

    // Flags — match frontend naming
    private boolean isFeatured;
    private boolean isNew;
    private boolean active;
    private boolean comingSoon;

    // Tags (derived: "new" if isNew, "featured" if isFeatured, "sale" if
    // originalPrice != price)
    private List<String> tags;

    // Reviews
    private Double rating; // average rating (was averageRating)
    private Long reviewCount;

    private LocalDateTime createdAt;
}
