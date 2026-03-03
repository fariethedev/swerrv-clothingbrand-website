package com.swerrv.swerrv.dto;

import com.swerrv.swerrv.model.OrderStatus;
import com.swerrv.swerrv.model.ShippingAddress;
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
public class OrderDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private List<OrderItemDTO> items;
    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal total;
    private ShippingAddress shippingAddress;
    private String paymentMethod;
    private String paymentReference;
    private String paymentIntentId;
    private String trackingNumber;
    private String courier;
    private String shippingLabelUrl;
    private LocalDateTime createdAt;
}
