package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @GetMapping("/test")
    public ResponseEntity<String> testEmail(@RequestParam String to) {
        try {
            emailService.sendPasswordResetEmail(to, "123456");
            return ResponseEntity.ok("Test email successfully sent to " + to + "!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        }
    }
}
