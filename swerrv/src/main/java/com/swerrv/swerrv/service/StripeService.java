package com.swerrv.swerrv.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.model.Cart;
import com.swerrv.swerrv.model.CartItem;
import com.swerrv.swerrv.model.Product;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey.trim();
    }

    public String createPaymentIntent(Cart cart, String currency) {
        if (cart == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        BigDecimal subtotal = cart.getItems().stream()
                .map(ci -> {
                    Product p = ci.getProduct();
                    BigDecimal price = p.getSalePrice() != null ? p.getSalePrice() : p.getPrice();
                    return price.multiply(BigDecimal.valueOf(ci.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Flat 8.99 PLN shipping (free for Lublin - handled on order confirmation)
        BigDecimal shippingCost = new BigDecimal("8.99");

        BigDecimal totalPln = subtotal.add(shippingCost);
        BigDecimal exchangeRate = getExchangeRate(currency);
        BigDecimal totalConverted = totalPln.multiply(exchangeRate);

        // Stripe expects amount in smallest currency unit (e.g., cents)
        long amountInSmallestUnit = totalConverted.multiply(new BigDecimal("100")).longValue();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amountInSmallestUnit);
        params.put("currency", currency != null ? currency.toLowerCase() : "pln");
        // Reverting to explicitly allowing only 'card' to prevent processing errors
        // with automatic methods on some test accounts
        java.util.List<String> paymentMethodTypes = new java.util.ArrayList<>();
        paymentMethodTypes.add("card");
        params.put("payment_method_types", paymentMethodTypes);

        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return paymentIntent.getClientSecret();
        } catch (StripeException e) {
            throw new BadRequestException("Failed to create payment intent: " + e.getMessage());
        }
    }

    private BigDecimal getExchangeRate(String currency) {
        if (currency == null)
            return BigDecimal.ONE;
        switch (currency.toUpperCase()) {
            case "EUR":
                return new BigDecimal("0.23");
            case "GBP":
                return new BigDecimal("0.20");
            case "CAD":
                return new BigDecimal("0.35");
            case "USD":
                return new BigDecimal("0.25");
            case "ZAR":
                return new BigDecimal("4.50");
            case "PLN":
            default:
                return BigDecimal.ONE;
        }
    }

    public boolean verifyPayment(String paymentIntentId) {
        if (paymentIntentId == null || paymentIntentId.trim().isEmpty()) {
            return false;
        }

        try {
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            return "succeeded".equals(intent.getStatus());
        } catch (StripeException e) {
            return false;
        }
    }
}
