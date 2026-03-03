package com.swerrv.swerrv.service;

import com.swerrv.swerrv.model.Order;
import com.swerrv.swerrv.model.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    // Usually we would inject JavaMailSender here, but as requested by the user's
    // implicit direction,
    // we will use a logger-based mock email sender for now until real SMTP
    // credentials are provided.

    public void sendOrderConfirmation(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n====================================================================\n");
        sb.append("MOCK EMAIL SENT TO: ").append(order.getUser().getEmail()).append("\n");
        sb.append("Subject: Order Confirmation - #").append(order.getId()).append("\n");
        sb.append("====================================================================\n\n");
        sb.append("Hi ").append(order.getShippingAddress().getFullName()).append(",\n\n");
        sb.append("Thank you for your order! We've received it and are getting it ready for shipment.\n\n");
        sb.append("Order Details:\n");

        for (OrderItem item : order.getItems()) {
            sb.append(String.format("- %dx %s (%s) - $%.2f\n",
                    item.getQuantity(),
                    item.getProductName(),
                    item.getSize() != null ? item.getSize() : "N/A",
                    item.getProductPrice().multiply(new BigDecimal(item.getQuantity()))));
        }

        sb.append("\nTotal: $").append(order.getTotal()).append("\n\n");
        sb.append("Shipping Address:\n");
        sb.append(order.getShippingAddress().getAddressLine1()).append("\n");
        if (order.getShippingAddress().getAddressLine2() != null
                && !order.getShippingAddress().getAddressLine2().isEmpty()) {
            sb.append(order.getShippingAddress().getAddressLine2()).append("\n");
        }
        sb.append(order.getShippingAddress().getCity()).append(", ")
                .append(order.getShippingAddress().getState()).append(" ")
                .append(order.getShippingAddress().getZipCode()).append("\n");
        sb.append(order.getShippingAddress().getCountry()).append("\n\n");

        sb.append("We will send you another email when your order ships.\n\n");
        sb.append("Best,\n");
        sb.append("The Swerrv Team\n");
        sb.append("====================================================================\n");

        log.info(sb.toString());
    }

    public void sendPasswordResetEmail(String email, String code) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n====================================================================\n");
        sb.append("MOCK EMAIL SENT TO: ").append(email).append("\n");
        sb.append("Subject: Swerrv - Password Reset Code\n");
        sb.append("====================================================================\n\n");
        sb.append("We received a request to reset your Swerrv account password.\n\n");
        sb.append("Your 6-digit password reset code is: ").append(code).append("\n\n");
        sb.append("This code will expire in 15 minutes.\n");
        sb.append("If you did not request a password reset, you can safely ignore this email.\n\n");
        sb.append("Best,\n");
        sb.append("The Swerrv Team\n");
        sb.append("====================================================================\n");

        log.info(sb.toString());
    }
}
