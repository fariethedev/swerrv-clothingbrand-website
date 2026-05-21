package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.dto.SubscribeRequest;
import com.swerrv.swerrv.model.NewsletterSubscriber;
import com.swerrv.swerrv.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody SubscribeRequest request) {
        newsletterService.subscribe(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Successfully subscribed to the SWERRV newsletter!"));
    }

    @GetMapping(value = "/unsubscribe", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> unsubscribe(@RequestParam String email) {
        newsletterService.unsubscribe(email);
        
        String html = "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "  <meta charset=\"utf-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>Unsubscribed - SWERRV</title>\n" +
                "  <style>\n" +
                "    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@800;900&display=swap');\n" +
                "    body {\n" +
                "      font-family: 'Inter', Arial, sans-serif;\n" +
                "      background-color: #0b0f19;\n" +
                "      color: #f3f4f6;\n" +
                "      margin: 0;\n" +
                "      padding: 0;\n" +
                "      display: flex;\n" +
                "      align-items: center;\n" +
                "      justify-content: center;\n" +
                "      min-height: 100vh;\n" +
                "      -webkit-font-smoothing: antialiased;\n" +
                "    }\n" +
                "    .container {\n" +
                "      max-width: 450px;\n" +
                "      width: 90%;\n" +
                "      text-align: center;\n" +
                "      background-color: #111827;\n" +
                "      border: 1px solid #1f2937;\n" +
                "      border-radius: 16px;\n" +
                "      padding: 40px 30px;\n" +
                "      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);\n" +
                "    }\n" +
                "    .logo {\n" +
                "      font-family: 'Outfit', 'Inter', Arial, sans-serif;\n" +
                "      font-size: 32px;\n" +
                "      font-weight: 900;\n" +
                "      letter-spacing: 8px;\n" +
                "      color: #ffffff;\n" +
                "      text-transform: uppercase;\n" +
                "      margin-bottom: 30px;\n" +
                "      display: inline-block;\n" +
                "    }\n" +
                "    h2 {\n" +
                "      font-family: 'Outfit', 'Inter', Arial, sans-serif;\n" +
                "      font-size: 22px;\n" +
                "      font-weight: 800;\n" +
                "      margin-top: 0;\n" +
                "      color: #ffffff;\n" +
                "      margin-bottom: 12px;\n" +
                "    }\n" +
                "    p {\n" +
                "      color: #9ca3af;\n" +
                "      font-size: 15px;\n" +
                "      line-height: 1.6;\n" +
                "      margin-bottom: 30px;\n" +
                "    }\n" +
                "    .btn {\n" +
                "      display: inline-block;\n" +
                "      background-color: #ff5a00;\n" +
                "      color: #ffffff !important;\n" +
                "      font-family: 'Outfit', 'Inter', Arial, sans-serif;\n" +
                "      font-size: 14px;\n" +
                "      font-weight: 800;\n" +
                "      text-transform: uppercase;\n" +
                "      letter-spacing: 1px;\n" +
                "      text-decoration: none;\n" +
                "      padding: 14px 28px;\n" +
                "      border-radius: 8px;\n" +
                "      box-shadow: 0 4px 12px rgba(255, 90, 0, 0.2);\n" +
                "    }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"logo\">SWERRV</div>\n" +
                "    <h2>You have been unsubscribed</h2>\n" +
                "    <p>We've removed <strong>" + email + "</strong> from our newsletter subscription list. You will no longer receive marketing emails from us.</p>\n" +
                "    <a href=\"http://localhost:5173\" class=\"btn\">Return to Store</a>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";

        return ResponseEntity.ok(html);
    }
}
