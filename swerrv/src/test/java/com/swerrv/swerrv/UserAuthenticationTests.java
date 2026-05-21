package com.swerrv.swerrv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swerrv.swerrv.controller.AuthController;
import com.swerrv.swerrv.dto.AuthRequest;
import com.swerrv.swerrv.dto.AuthResponse;
import com.swerrv.swerrv.dto.RegisterRequest;
import com.swerrv.swerrv.model.Cart;
import com.swerrv.swerrv.model.Role;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.model.Wishlist;
import com.swerrv.swerrv.repository.CartRepository;
import com.swerrv.swerrv.repository.UserRepository;
import com.swerrv.swerrv.repository.WishlistRepository;
import com.swerrv.swerrv.security.JwtUtil;
import com.swerrv.swerrv.security.SecurityConfig;
import com.swerrv.swerrv.service.AuthService;
import com.swerrv.swerrv.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
public class UserAuthenticationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    // ── Controller Tests ──────────────────────────────────────────────────────

    @Test
    void userCanRegister() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPassword("Password123!");

        AuthResponse response = AuthResponse.builder()
                .userId(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .accessToken("mock-access-token")
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(1L))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"));
    }

    @Test
    void userCanLogin() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("john.doe@example.com");
        request.setPassword("Password123!");

        AuthResponse response = AuthResponse.builder()
                .userId(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .accessToken("mock-access-token")
                .build();

        when(authService.login(any(AuthRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1L))
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"));
    }

    // ── Service Tests ─────────────────────────────────────────────────────────

    @Test
    void serviceRegisterCreatesCartAndWishlist() {
        UserRepository userRepository = mock(UserRepository.class);
        CartRepository cartRepository = mock(CartRepository.class);
        WishlistRepository wishlistRepository = mock(WishlistRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtUtil mockJwtUtil = mock(JwtUtil.class);
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        com.swerrv.swerrv.repository.PasswordResetTokenRepository passwordResetTokenRepository = mock(com.swerrv.swerrv.repository.PasswordResetTokenRepository.class);
        EmailService emailService = mock(EmailService.class);

        AuthService authServiceTest = new AuthService(
                userRepository,
                cartRepository,
                wishlistRepository,
                passwordEncoder,
                mockJwtUtil,
                authenticationManager,
                passwordResetTokenRepository,
                emailService
        );

        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPassword("Password123!");

        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(mockJwtUtil.generateToken(any(User.class))).thenReturn("access-token-123");
        when(mockJwtUtil.generateRefreshToken(any(User.class))).thenReturn("refresh-token-123");

        AuthResponse response = authServiceTest.register(request);

        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getAccessToken()).isEqualTo("access-token-123");
        verify(userRepository).save(any(User.class));
        verify(cartRepository).save(any(Cart.class));
        verify(wishlistRepository).save(any(Wishlist.class));
    }
}
