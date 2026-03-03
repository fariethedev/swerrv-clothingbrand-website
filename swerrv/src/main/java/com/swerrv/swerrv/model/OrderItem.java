package com.swerrv.swerrv.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Snapshot of product at time of purchase
    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    @Column(precision = 10, scale = 2)
    private BigDecimal productPrice;

    @Column(columnDefinition = "TEXT")
    private String productImage;

    private String size;
    private String color;

    @Column(nullable = false)
    private Integer quantity;
}
