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

    private static final String DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${swerrv.mail.from}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmation(Order order) {
        String addressLine2Str = "";
        if (order.getShippingAddress().getAddressLine2() != null && !order.getShippingAddress().getAddressLine2().trim().isEmpty()) {
            addressLine2Str = order.getShippingAddress().getAddressLine2() + "<br>";
        }

        String trackingInfoStr;
        if (order.getTrackingNumber() != null && !order.getTrackingNumber().trim().isEmpty()) {
            trackingInfoStr = "Courier: <strong>" + (order.getCourier() != null ? order.getCourier() : "Standard Delivery") + "</strong><br>" +
                              "Tracking number: <strong style=\"color: #ff5a00;\">" + order.getTrackingNumber() + "</strong>";
        } else {
            trackingInfoStr = "Your package is being prepared for shipment. We will send you another email with tracking details as soon as it leaves our warehouse.";
        }

        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            BigDecimal itemTotal = item.getProductPrice().multiply(new BigDecimal(item.getQuantity()));
            
            StringBuilder details = new StringBuilder();
            if (item.getSize() != null && !item.getSize().trim().isEmpty()) {
                details.append("Size: ").append(item.getSize());
            }
            if (item.getColor() != null && !item.getColor().trim().isEmpty()) {
                if (details.length() > 0) details.append(" | ");
                details.append("Color: ").append(item.getColor());
            }
            String detailsStr = details.toString();
            
            String imgUrl = (item.getProductImage() != null && !item.getProductImage().trim().isEmpty())
                    ? item.getProductImage()
                    : DEFAULT_PRODUCT_IMAGE;
                    
            itemsHtml.append("          <tr>\n")
                    .append("            <td valign=\"top\" style=\"padding: 12px 0; border-bottom: 1px solid #f3f4f6;\">\n")
                    .append("              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n")
                    .append("                <tr>\n")
                    .append("                  <td width=\"70\" valign=\"top\">\n")
                    .append("                    <img src=\"").append(imgUrl).append("\" width=\"60\" height=\"60\" style=\"object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; display: block;\">\n")
                    .append("                  </td>\n")
                    .append("                  <td valign=\"top\" style=\"padding-left: 15px;\">\n")
                    .append("                    <h4 style=\"margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #111827;\">").append(item.getProductName()).append("</h4>\n")
                    .append("                    <p style=\"margin: 0; font-size: 12px; color: #6b7280;\">").append(detailsStr).append("</p>\n")
                    .append("                  </td>\n")
                    .append("                  <td valign=\"top\" align=\"right\" style=\"padding-left: 10px;\">\n")
                    .append("                    <div style=\"font-size: 14px; font-weight: 700; color: #111827;\">$").append(itemTotal).append("</div>\n")
                    .append("                    <div style=\"font-size: 12px; color: #6b7280; margin-top: 4px;\">").append(item.getQuantity()).append(" x $").append(item.getProductPrice()).append("</div>\n")
                    .append("                  </td>\n")
                    .append("                </tr>\n")
                    .append("              </table>\n")
                    .append("            </td>\n")
                    .append("          </tr>\n");
        }

        String orderDate = order.getCreatedAt() != null 
                ? order.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")) 
                : "";

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>\n")
            .append("<html>\n")
            .append("<head>\n")
            .append("  <meta charset=\"utf-8\">\n")
            .append("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n")
            .append("  <title>Order Confirmation</title>\n")
            .append("  <style>\n")
            .append("    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;800;900&display=swap');\n")
            .append("    \n")
            .append("    body {\n")
            .append("      font-family: 'Inter', Arial, sans-serif;\n")
            .append("      background-color: #f3f4f6;\n")
            .append("      margin: 0;\n")
            .append("      padding: 0;\n")
            .append("      -webkit-font-smoothing: antialiased;\n")
            .append("    }\n")
            .append("    \n")
            .append("    @media only screen and (max-width: 600px) {\n")
            .append("      .container {\n")
            .append("        width: 100% !important;\n")
            .append("        margin: 0 !important;\n")
            .append("        border-radius: 0 !important;\n")
            .append("      }\n")
            .append("      .col {\n")
            .append("        display: block !important;\n")
            .append("        width: 100% !important;\n")
            .append("        padding-left: 0 !important;\n")
            .append("        padding-right: 0 !important;\n")
            .append("        margin-bottom: 20px !important;\n")
            .append("      }\n")
            .append("      .col-last {\n")
            .append("        margin-bottom: 0 !important;\n")
            .append("      }\n")
            .append("    }\n")
            .append("  </style>\n")
            .append("</head>\n")
            .append("<body style=\"font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;\">\n")
            .append("\n")
            .append("  <table class=\"container\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #ffffff; border-radius: 12px; overflow: hidden; border-collapse: collapse; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: 20px auto;\">\n")
            .append("    \n")
            .append("    <!-- BRAND HEADER (Black Swerrv Banner) -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"background-color: #000000; padding: 25px; text-align: center;\">\n")
            .append("        <span style=\"font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 26px; font-weight: 900; letter-spacing: 6px; color: #ffffff; text-transform: uppercase;\">SWERRV</span>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- MAIN STATUS BLOCK -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 30px 30px 20px 30px;\">\n")
            .append("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px; border-collapse: collapse;\">\n")
            .append("          <tr>\n")
            .append("            <td style=\"padding: 20px;\">\n")
            .append("              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n")
            .append("                <tr>\n")
            .append("                  <td width=\"40\" valign=\"top\" style=\"padding-top: 2px;\">\n")
            .append("                    <span style=\"display: inline-block; background-color: #10b981; color: #ffffff; font-size: 18px; line-height: 24px; text-align: center; width: 24px; height: 24px; border-radius: 50%; font-weight: bold;\">&#10003;</span>\n")
            .append("                  </td>\n")
            .append("                  <td valign=\"top\">\n")
            .append("                    <h2 style=\"margin: 0 0 6px 0; font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 18px; font-weight: 800; color: #065f46;\">Order Confirmed!</h2>\n")
            .append("                    <p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #047857;\">Hi ").append(order.getShippingAddress().getFullName()).append(", we've received your order and payment. We are packing your items and will notify you when it's shipped.</p>\n")
            .append("                  </td>\n")
            .append("                </tr>\n")
            .append("              </table>\n")
            .append("            </td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- ORDER INFO OVERVIEW -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 0 30px 20px 30px;\">\n")
            .append("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"font-size: 13px; color: #4b5563;\">\n")
            .append("          <tr>\n")
            .append("            <td style=\"padding-bottom: 5px;\">Order number: <strong style=\"color: #111827;\">#").append(order.getId()).append("</strong></td>\n")
            .append("            <td align=\"right\" style=\"padding-bottom: 5px;\">Date: <strong style=\"color: #111827;\">").append(orderDate).append("</strong></td>\n")
            .append("          </tr>\n")
            .append("          <tr>\n")
            .append("            <td>Payment method: <strong style=\"color: #111827; text-transform: uppercase;\">").append(order.getPaymentMethod()).append("</strong></td>\n")
            .append("            <td align=\"right\">Status: <span style=\"background-color: #f3f4f6; color: #1f2937; padding: 2px 8px; border-radius: 20px; font-weight: 600; font-size: 11px;\">PAID</span></td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- ORDERED ITEMS SECTION -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 0 30px;\">\n")
            .append("        <h3 style=\"margin: 0 0 15px 0; font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 16px; font-weight: 800; color: #111827; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;\">Order Details</h3>\n")
            .append("        \n")
            .append("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;\">\n")
            .append(itemsHtml.toString())
            .append("        </table>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- TOTALS BILLING SECTION -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 20px 30px 30px 30px;\">\n")
            .append("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f9fafb; border-radius: 8px; border-collapse: collapse;\">\n")
            .append("          <tr>\n")
            .append("            <td style=\"padding: 20px;\">\n")
            .append("              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"font-size: 14px; line-height: 24px; color: #4b5563;\">\n")
            .append("                <tr>\n")
            .append("                  <td>Items Subtotal</td>\n")
            .append("                  <td align=\"right\" style=\"font-weight: 500; color: #111827;\">$").append(order.getSubtotal()).append("</td>\n")
            .append("                </tr>\n")
            .append("                <tr>\n")
            .append("                  <td>Shipping & Delivery</td>\n")
            .append("                  <td align=\"right\" style=\"font-weight: 500; color: #111827;\">$").append(order.getShippingCost()).append("</td>\n")
            .append("                </tr>\n")
            .append("                <tr style=\"font-size: 16px; font-weight: bold; color: #111827;\">\n")
            .append("                  <td style=\"padding-top: 10px; border-top: 1px solid #e5e7eb; margin-top: 10px;\">Total Price</td>\n")
            .append("                  <td align=\"right\" style=\"padding-top: 10px; border-top: 1px solid #e5e7eb; margin-top: 10px; color: #ff5a00; font-size: 18px;\">$").append(order.getTotal()).append("</td>\n")
            .append("                </tr>\n")
            .append("              </table>\n")
            .append("            </td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- SHIPPING & BILLING ADDRESS GRID -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 0 30px 30px 30px;\">\n")
            .append("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;\">\n")
            .append("          <tr>\n")
            .append("            <td class=\"col\" valign=\"top\" width=\"48%\" style=\"background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #f3f4f6;\">\n")
            .append("              <h4 style=\"margin: 0 0 10px 0; font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;\">Delivery Address</h4>\n")
            .append("              <p style=\"margin: 0; font-size: 13px; line-height: 18px; color: #4b5563;\">\n")
            .append("                <strong>").append(order.getShippingAddress().getFullName()).append("</strong><br>\n")
            .append("                ").append(order.getShippingAddress().getAddressLine1()).append("<br>\n")
            .append("                ").append(addressLine2Str).append("\n")
            .append("                ").append(order.getShippingAddress().getCity()).append(", ").append(order.getShippingAddress().getState()).append(" ").append(order.getShippingAddress().getZipCode()).append("<br>\n")
            .append("                ").append(order.getShippingAddress().getCountry()).append("<br>\n")
            .append("                <span style=\"display: inline-block; margin-top: 5px; color: #6b7280;\">Phone: ").append(order.getShippingAddress().getPhone() != null ? order.getShippingAddress().getPhone() : "N/A").append("</span>\n")
            .append("              </p>\n")
            .append("            </td>\n")
            .append("            \n")
            .append("            <td width=\"4%\">&nbsp;</td>\n")
            .append("            \n")
            .append("            <td class=\"col col-last\" valign=\"top\" width=\"48%\" style=\"background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #f3f4f6;\">\n")
            .append("              <h4 style=\"margin: 0 0 10px 0; font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;\">Order Tracking</h4>\n")
            .append("              <p style=\"margin: 0; font-size: 13px; line-height: 18px; color: #4b5563;\">\n")
            .append("                ").append(trackingInfoStr).append("\n")
            .append("              </p>\n")
            .append("            </td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- BUTTON CALL TO ACTION -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 0 30px 40px 30px; text-align: center;\">\n")
            .append("        <a href=\"https://www.swerrv.shop/account/orders\" target=\"_blank\" style=\"display: inline-block; background-color: #ff5a00; color: #ffffff; font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 15px 35px; border-radius: 6px; box-shadow: 0 4px 6px rgba(255, 90, 0, 0.2); transition: background-color 0.2s;\">View Your Order</a>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- FOOTER -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; line-height: 20px;\">\n")
            .append("        <p style=\"margin: 0 0 10px 0;\">This is an automated order confirmation from <strong>SWERRV</strong>.</p>\n")
            .append("        <p style=\"margin: 0 0 15px 0;\">If you have any questions, please contact our support team at <a href=\"mailto:support@swerrv.shop\" style=\"color: #ff5a00; text-decoration: none; font-weight: 500;\">support@swerrv.shop</a>.</p>\n")
            .append("        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0 auto;\">\n")
            .append("          <tr>\n")
            .append("            <td><a href=\"https://www.swerrv.shop/terms\" style=\"color: #6b7280; text-decoration: none; padding: 0 8px;\">Terms & Conditions</a></td>\n")
            .append("            <td style=\"color: #d1d5db;\">|</td>\n")
            .append("            <td><a href=\"https://www.swerrv.shop/privacy\" style=\"color: #6b7280; text-decoration: none; padding: 0 8px;\">Privacy Policy</a></td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("        <p style=\"margin: 15px 0 0 0; font-size: 11px;\">&copy; 2026 SWERRV Clothing. All rights reserved.</p>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("  </table>\n")
            .append("  \n")
            .append("</body>\n")
            .append("</html>");

        sendResendEmail(
                order.getUser().getEmail(),
                "Order Confirmation - #" + order.getId(),
                html.toString()
        );
    }

    @Async
    public void sendPasswordResetEmail(String email, String code) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>\n")
            .append("<html>\n")
            .append("<head>\n")
            .append("  <meta charset=\"utf-8\">\n")
            .append("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n")
            .append("  <title>Reset Password</title>\n")
            .append("  <style>\n")
            .append("    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;800;900&display=swap');\n")
            .append("    \n")
            .append("    body {\n")
            .append("      font-family: 'Inter', Arial, sans-serif;\n")
            .append("      background-color: #f3f4f6;\n")
            .append("      margin: 0;\n")
            .append("      padding: 0;\n")
            .append("      -webkit-font-smoothing: antialiased;\n")
            .append("    }\n")
            .append("  </style>\n")
            .append("</head>\n")
            .append("<body style=\"font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;\">\n")
            .append("\n")
            .append("  <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"550\" style=\"background-color: #ffffff; border-radius: 12px; overflow: hidden; border-collapse: collapse; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: 20px auto;\">\n")
            .append("    \n")
            .append("    <!-- BRAND HEADER -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"background-color: #000000; padding: 25px; text-align: center;\">\n")
            .append("        <span style=\"font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 26px; font-weight: 900; letter-spacing: 6px; color: #ffffff; text-transform: uppercase;\">SWERRV</span>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- MAIN CONTENT BLOCK -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"padding: 40px 30px;\">\n")
            .append("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #fffaf0; border-left: 4px solid #ff5a00; border-radius: 4px; border-collapse: collapse; margin-bottom: 30px;\">\n")
            .append("          <tr>\n")
            .append("            <td style=\"padding: 20px;\">\n")
            .append("              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n")
            .append("                <tr>\n")
            .append("                  <td width=\"40\" valign=\"top\" style=\"padding-top: 2px;\">\n")
            .append("                    <span style=\"display: inline-block; background-color: #ff5a00; color: #ffffff; font-size: 16px; line-height: 24px; text-align: center; width: 24px; height: 24px; border-radius: 50%; font-weight: bold;\">&#128274;</span>\n")
            .append("                  </td>\n")
            .append("                  <td valign=\"top\">\n")
            .append("                    <h2 style=\"margin: 0 0 6px 0; font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 18px; font-weight: 800; color: #9a3412;\">Password Reset Request</h2>\n")
            .append("                    <p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #c2410c;\">We received a request to reset your Swerrv account password. If you didn't request this, you can ignore this email.</p>\n")
            .append("                  </td>\n")
            .append("                </tr>\n")
            .append("              </table>\n")
            .append("            </td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("        \n")
            .append("        <p style=\"font-size: 15px; line-height: 22px; color: #4b5563; margin: 0 0 25px 0;\">Use the following 6-digit confirmation code to reset your password. This code is active for <strong>15 minutes</strong>:</p>\n")
            .append("        \n")
            .append("        <!-- CODE DISPLAY CARD -->\n")
            .append("        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 8px; border-collapse: collapse; margin-bottom: 30px;\">\n")
            .append("          <tr>\n")
            .append("            <td style=\"padding: 25px; text-align: center;\">\n")
            .append("              <div style=\"font-family: 'Outfit', 'Inter', Arial, sans-serif; font-size: 38px; font-weight: 900; color: #ff5a00; letter-spacing: 8px;\">").append(code).append("</div>\n")
            .append("            </td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("        \n")
            .append("        <p style=\"font-size: 13px; line-height: 20px; color: #9ca3af; margin: 0; text-align: center;\">For security reasons, never share this code with anyone. Our support team will never ask for your code.</p>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("    <!-- FOOTER -->\n")
            .append("    <tr>\n")
            .append("      <td style=\"background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; line-height: 20px;\">\n")
            .append("        <p style=\"margin: 0 0 10px 0;\">This email was sent by <strong>SWERRV</strong>.</p>\n")
            .append("        <p style=\"margin: 0 0 15px 0;\">If you have any questions, please contact our support team at <a href=\"mailto:support@swerrv.shop\" style=\"color: #ff5a00; text-decoration: none; font-weight: 500;\">support@swerrv.shop</a>.</p>\n")
            .append("        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0 auto;\">\n")
            .append("          <tr>\n")
            .append("            <td><a href=\"https://www.swerrv.shop/terms\" style=\"color: #6b7280; text-decoration: none; padding: 0 8px;\">Terms & Conditions</a></td>\n")
            .append("            <td style=\"color: #d1d5db;\">|</td>\n")
            .append("            <td><a href=\"https://www.swerrv.shop/privacy\" style=\"color: #6b7280; text-decoration: none; padding: 0 8px;\">Privacy Policy</a></td>\n")
            .append("          </tr>\n")
            .append("        </table>\n")
            .append("        <p style=\"margin: 15px 0 0 0; font-size: 11px;\">&copy; 2026 SWERRV Clothing. All rights reserved.</p>\n")
            .append("      </td>\n")
            .append("    </tr>\n")
            .append("    \n")
            .append("  </table>\n")
            .append("  \n")
            .append("</body>\n")
            .append("</html>");

        sendResendEmail(
                email,
                "Swerrv - Password Reset Code",
                html.toString()
        );
    }

    @Async
    public void sendNewsletterEmail(String to, String subject, String bodyHtml) {
        String fullHtml = wrapInNewsletterTemplate(bodyHtml, to);
        sendResendEmail(to, subject, fullHtml);
    }

    private String wrapInNewsletterTemplate(String bodyHtml, String to) {
        String unsubscribeLink = "http://localhost:8080/api/newsletter/unsubscribe?email=";
        try {
            unsubscribeLink += java.net.URLEncoder.encode(to, java.nio.charset.StandardCharsets.UTF_8.toString());
        } catch (java.io.UnsupportedEncodingException e) {
            unsubscribeLink += to;
        }

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "  <meta charset=\"utf-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>SWERRV Newsletter</title>\n" +
                "  <style>\n" +
                "    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@800;900&display=swap');\n" +
                "    body {\n" +
                "      font-family: 'Inter', Arial, sans-serif;\n" +
                "      background-color: #0b0f19;\n" +
                "      color: #f3f4f6;\n" +
                "      margin: 0;\n" +
                "      padding: 0;\n" +
                "      -webkit-font-smoothing: antialiased;\n" +
                "    }\n" +
                "    .email-container {\n" +
                "      max-width: 600px;\n" +
                "      margin: 40px auto;\n" +
                "      background-color: #111827;\n" +
                "      border: 1px solid #1f2937;\n" +
                "      border-radius: 16px;\n" +
                "      overflow: hidden;\n" +
                "      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);\n" +
                "    }\n" +
                "    .header {\n" +
                "      background-color: #000000;\n" +
                "      padding: 30px;\n" +
                "      text-align: center;\n" +
                "      border-bottom: 1px solid #1f2937;\n" +
                "    }\n" +
                "    .logo {\n" +
                "      font-family: 'Outfit', 'Inter', Arial, sans-serif;\n" +
                "      font-size: 28px;\n" +
                "      font-weight: 900;\n" +
                "      letter-spacing: 8px;\n" +
                "      color: #ffffff;\n" +
                "      text-transform: uppercase;\n" +
                "      text-decoration: none;\n" +
                "    }\n" +
                "    .content {\n" +
                "      padding: 40px 35px;\n" +
                "      font-size: 16px;\n" +
                "      line-height: 1.6;\n" +
                "      color: #d1d5db;\n" +
                "    }\n" +
                "    .content h1, .content h2, .content h3 {\n" +
                "      color: #ffffff;\n" +
                "      font-family: 'Outfit', 'Inter', Arial, sans-serif;\n" +
                "      margin-top: 0;\n" +
                "    }\n" +
                "    .content p {\n" +
                "      margin-bottom: 20px;\n" +
                "    }\n" +
                "    .button-container {\n" +
                "      text-align: center;\n" +
                "      margin: 30px 0;\n" +
                "    }\n" +
                "    .button {\n" +
                "      display: inline-block;\n" +
                "      background-color: #ff5a00;\n" +
                "      color: #ffffff !important;\n" +
                "      font-family: 'Outfit', 'Inter', Arial, sans-serif;\n" +
                "      font-size: 15px;\n" +
                "      font-weight: 800;\n" +
                "      text-transform: uppercase;\n" +
                "      letter-spacing: 1px;\n" +
                "      text-decoration: none;\n" +
                "      padding: 15px 35px;\n" +
                "      border-radius: 8px;\n" +
                "      box-shadow: 0 4px 12px rgba(255, 90, 0, 0.3);\n" +
                "    }\n" +
                "    .footer {\n" +
                "      background-color: #080c14;\n" +
                "      padding: 30px;\n" +
                "      text-align: center;\n" +
                "      border-top: 1px solid #1f2937;\n" +
                "      font-size: 12px;\n" +
                "      color: #6b7280;\n" +
                "      line-height: 1.8;\n" +
                "    }\n" +
                "    .footer a {\n" +
                "      color: #ff5a00;\n" +
                "      text-decoration: none;\n" +
                "    }\n" +
                "    .footer a:hover {\n" +
                "      text-decoration: underline;\n" +
                "    }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"email-container\">\n" +
                "    <div class=\"header\">\n" +
                "      <a href=\"https://swerrv.shop\" class=\"logo\">SWERRV</a>\n" +
                "    </div>\n" +
                "    <div class=\"content\">\n" +
                "      " + bodyHtml + "\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      <p style=\"margin: 0 0 10px 0;\">You are receiving this email because you subscribed to updates from SWERRV.</p>\n" +
                "      <p style=\"margin: 0 0 15px 0;\">\n" +
                "        <a href=\"" + unsubscribeLink + "\">Unsubscribe</a> | \n" +
                "        <a href=\"https://swerrv.shop/privacy\">Privacy Policy</a>\n" +
                "      </p>\n" +
                "      <p style=\"margin: 0; font-size: 11px; color: #4b5563;\">&copy; 2026 SWERRV Clothing. All rights reserved.</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
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
