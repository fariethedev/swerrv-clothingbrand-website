package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.AuthRequest;
import com.swerrv.swerrv.dto.AuthResponse;
import com.swerrv.swerrv.dto.RegisterRequest;
import com.swerrv.swerrv.dto.UpdateProfileRequest;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.model.Cart;
import com.swerrv.swerrv.model.Role;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.model.Wishlist;
import com.swerrv.swerrv.repository.CartRepository;
import com.swerrv.swerrv.repository.UserRepository;
import com.swerrv.swerrv.repository.WishlistRepository;
import com.swerrv.swerrv.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final com.swerrv.swerrv.repository.PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${google.client.id}")
    private String googleClientId;

    // ── Register ─────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .profilePictureUrl(request.getProfilePictureUrl())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .build();

        user = userRepository.save(user);

        // Create empty cart and wishlist for new user
        cartRepository.save(Cart.builder().user(user).build());
        wishlistRepository.save(Wishlist.builder().user(user).build());

        return buildAuthResponse(user);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = (User) authentication.getPrincipal();
        return buildAuthResponse(user);
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse updateProfile(UpdateProfileRequest request, String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use: " + request.getEmail());
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());
        user.setSecondAddress(request.getSecondAddress());

        user = userRepository.save(user);

        return buildAuthResponse(user);
    }

    // ── Password Reset ────────────────────────────────────────────────────────

    @Transactional
    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        // Generate a random 6 digit code
        String code = String.format("%06d", new Random().nextInt(999999));

        com.swerrv.swerrv.model.PasswordResetToken token = com.swerrv.swerrv.model.PasswordResetToken.builder()
                .token(code)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        passwordResetTokenRepository.save(token);

        // Send Email
        emailService.sendPasswordResetEmail(user.getEmail(), code);
    }

    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        com.swerrv.swerrv.model.PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndUser(token, user)
                .orElseThrow(() -> new BadRequestException("Invalid reset token for this email"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BadRequestException("This reset token has expired.");
        }

        // Token is valid, update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Clean up token after successful reset
        passwordResetTokenRepository.delete(resetToken);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }

    // ── Google Login ─────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse googleLogin(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new BadRequestException("Invalid ID token.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");

            Optional<User> userOptional = userRepository.findByEmail(email);
            User user;

            if (userOptional.isPresent()) {
                user = userOptional.get();
                // We could optionally update names here if they changed on Google
            } else {
                // User doesn't exist, create a new one
                user = User.builder()
                        .firstName(firstName != null ? firstName : "Google")
                        .lastName(lastName != null ? lastName : "User")
                        .email(email)
                        // They log in via Google, so we set a random dummy password
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(Role.USER)
                        .active(true)
                        .build();

                user = userRepository.save(user);

                // Initialize cart and wishlist
                cartRepository.save(Cart.builder().user(user).build());
                wishlistRepository.save(Wishlist.builder().user(user).build());
            }

            return buildAuthResponse(user);
        } catch (Exception e) {
            throw new BadRequestException("Failed to authenticate with Google: " + e.getMessage());
        }
    }
}
