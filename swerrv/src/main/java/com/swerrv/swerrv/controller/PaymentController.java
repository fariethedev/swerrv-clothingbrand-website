package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.dto.PaymentIntentResponse;
import com.swerrv.swerrv.model.Cart;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.repository.CartRepository;
import com.swerrv.swerrv.service.StripeService;
import com.swerrv.swerrv.exception.BadRequestException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment API", description = "Endpoints for Stripe payment integration")
public class PaymentController {

    private final StripeService stripeService;
    private final CartRepository cartRepository;

    @PostMapping("/create-intent")
    @Operation(summary = "Create a Stripe PaymentIntent for the current user's cart")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@AuthenticationPrincipal User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create payment intent with an empty cart");
        }

        String clientSecret = stripeService.createPaymentIntent(cart);
        return ResponseEntity.ok(new PaymentIntentResponse(clientSecret));
    }
}
