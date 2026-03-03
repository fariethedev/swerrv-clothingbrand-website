package com.swerrv.swerrv.dto;

import com.swerrv.swerrv.model.ShippingAddress;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @NotNull
    private ShippingAddress shippingAddress;

    private String paymentMethod = "card";
    private String paymentReference;
    private String paymentIntentId;
}
