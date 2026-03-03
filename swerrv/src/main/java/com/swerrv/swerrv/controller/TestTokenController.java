package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.model.PasswordResetToken;
import com.swerrv.swerrv.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/test-token")
@RequiredArgsConstructor
public class TestTokenController {

    private final PasswordResetTokenRepository tokenRepository;

    @GetMapping
    public ResponseEntity<String> getLatestToken() {
        List<PasswordResetToken> tokens = tokenRepository.findAll();
        if (tokens.isEmpty()) {
            return ResponseEntity.ok("No tokens found in database.");
        }
        PasswordResetToken latest = tokens.get(tokens.size() - 1);
        return ResponseEntity
                .ok("Latest Token Code: " + latest.getToken() + " for user: " + latest.getUser().getEmail());
    }
}
