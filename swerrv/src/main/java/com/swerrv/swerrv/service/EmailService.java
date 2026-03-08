package com.swerrv.swerrv.service;

import com.swerrv.swerrv.model.Order;
import com.swerrv.swerrv.model.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${swerrv.mail.from:faraimahaso8@gmail.com}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmation(Order order) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Order Confirmation - #" + order.getId());

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

            helper.setText(html.toString(), true);
            emailSender.send(message);
            log.info("Order confirmation email sent to: {}", order.getUser().getEmail());

        } catch (MessagingException e) {
            log.error("Failed to send order confirmation email to {}", order.getUser().getEmail(), e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String email, String code) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Swerrv - Password Reset Code");

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

            helper.setText(html.toString(), true);
            emailSender.send(message);
            log.info("Password reset email sent to: {}", email);

        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}", email, e);
        }
    }
}
