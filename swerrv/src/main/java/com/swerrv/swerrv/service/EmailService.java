package com.swerrv.swerrv.service;

import com.swerrv.swerrv.model.Order;
import com.swerrv.swerrv.model.OrderItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${swerrv.mail.from}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmation(Order order) {
        StringBuilder html = new StringBuilder();
        html.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
        html.append("<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>");
        html.append("<h2 style='color: #000;'>Thank you for your order!</h2>");
        html.append("<p>Hi ").append(order.getShippingAddress().getFullName()).append(",</p>");
        html.append("<p>We've received your order and are getting it ready for shipment.</p>");

        html.append("<h3 style='border-bottom: 2px solid #eee; padding-bottom: 10px;'>Order Details</h3>");
        html.append("<table style='width: 100%; border-collapse: collapse;'>");

        for (OrderItem item : order.getItems()) {
            BigDecimal itemTotal = item.getProductPrice().multiply(new BigDecimal(item.getQuantity()));
            html.append("<tr>")
                    .append("<td style='padding: 10px 0;'>")
                    .append("<strong>").append(item.getQuantity()).append("x</strong> ")
                    .append(item.getProductName())
                    .append(" (").append(item.getSize() != null ? item.getSize() : "N/A").append(")")
                    .append("</td>")
                    .append("<td style='padding: 10px 0; text-align: right;'>")
                    .append("$").append(itemTotal)
                    .append("</td>")
                    .append("</tr>");
        }

        html.append("<tr>")
                .append("<td style='padding: 15px 0; border-top: 2px solid #eee;'><strong>Total</strong></td>")
                .append("<td style='padding: 15px 0; border-top: 2px solid #eee; text-align: right;'><strong>$")
                .append(order.getTotal()).append("</strong></td>")
                .append("</tr>");
        html.append("</table>");

        html.append("<h3>Shipping Address</h3>");
        html.append("<p style='background: #f9f9f9; padding: 15px; border-radius: 4px;'>");
        html.append(order.getShippingAddress().getAddressLine1()).append("<br>");
        if (order.getShippingAddress().getAddressLine2() != null
                && !order.getShippingAddress().getAddressLine2().isEmpty()) {
            html.append(order.getShippingAddress().getAddressLine2()).append("<br>");
        }
        html.append(order.getShippingAddress().getCity()).append(", ")
                .append(order.getShippingAddress().getState()).append(" ")
                .append(order.getShippingAddress().getZipCode()).append("<br>");
        html.append(order.getShippingAddress().getCountry());
        html.append("</p>");

        html.append("<p>We will send you another email when your order ships.</p>");
        html.append("<p>Best,<br><strong>The Swerrv Team</strong></p>");
        html.append("</div></body></html>");

        sendResendEmail(
                order.getUser().getEmail(),
                "Order Confirmation - #" + order.getId(),
                html.toString()
        );
    }

    @Async
    public void sendPasswordResetEmail(String email, String code) {
        StringBuilder html = new StringBuilder();
        html.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
        html.append("<div style='max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;'>");
        html.append("<h2 style='color: #000;'>Password Reset</h2>");
        html.append("<p>We received a request to reset your Swerrv account password.</p>");
        html.append("<p>Your 6-digit password reset code is:</p>");
        html.append(
                "<div style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; padding: 20px; background: #f4f4f4; display: inline-block; border-radius: 8px; margin: 20px 0;'>")
                .append(code)
                .append("</div>");
        html.append("<p>This code will expire in 15 minutes.</p>");
        html.append(
                "<p style='color: #888; font-size: 12px;'>If you did not request a password reset, you can safely ignore this email.</p>");
        html.append("</div></body></html>");

        sendResendEmail(
                email,
                "Swerrv - Password Reset Code",
                html.toString()
        );
    }

    private void sendResendEmail(String to, String subject, String htmlContent) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "from", fromEmail,
                    "to", List.of(to),
                    "subject", subject,
                    "html", htmlContent
            );

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.resend.com/emails",
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent successfully via Resend to: {}", to);
            } else {
                log.error("Failed to send email via Resend to {}. Status: {}, Response: {}", to, response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Exception occurred while sending email via Resend to {}", to, e);
        }
    }
}
