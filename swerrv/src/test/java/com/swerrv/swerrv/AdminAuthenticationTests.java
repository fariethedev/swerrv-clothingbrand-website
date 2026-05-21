package com.swerrv.swerrv;

import com.swerrv.swerrv.controller.AdminController;
import com.swerrv.swerrv.dto.AuthRequest;
import com.swerrv.swerrv.dto.AuthResponse;
import com.swerrv.swerrv.model.Role;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.repository.UserRepository;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {AdminController.class})
@Import(SecurityConfig.class)
public class AdminAuthenticationTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.swerrv.swerrv.service.AdminService adminService;

    @MockBean
    private com.swerrv.swerrv.service.OrderService orderService;

    @MockBean
    private com.swerrv.swerrv.service.NewsletterService newsletterService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    // ── Route Protection Tests ────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanAccessDashboard() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void userCannotAccessDashboard() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedCannotAccessDashboard() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // ── Admin Login Service Test ──────────────────────────────────────────────

    @Test
    void serviceAdminLoginReturnsAdminRoleAndToken() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtUtil mockJwtUtil = mock(JwtUtil.class);
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        com.swerrv.swerrv.repository.CartRepository cartRepository = mock(com.swerrv.swerrv.repository.CartRepository.class);
        com.swerrv.swerrv.repository.WishlistRepository wishlistRepository = mock(com.swerrv.swerrv.repository.WishlistRepository.class);
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

        User adminUser = User.builder()
                .id(2L)
                .email("admin@swerrv.com")
                .password("hashedPassword")
                .role(Role.ADMIN)
                .active(true)
                .build();

        AuthRequest request = new AuthRequest();
        request.setEmail("admin@swerrv.com");
        request.setPassword("AdminPassword123!");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(adminUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("admin@swerrv.com")).thenReturn(Optional.of(adminUser));
        when(mockJwtUtil.generateToken(adminUser)).thenReturn("admin-access-token");
        when(mockJwtUtil.generateRefreshToken(adminUser)).thenReturn("admin-refresh-token");

        AuthResponse response = authServiceTest.login(request);

        assertThat(response.getUserId()).isEqualTo(2L);
        assertThat(response.getRole()).isEqualTo(Role.ADMIN);
        assertThat(response.getAccessToken()).isEqualTo("admin-access-token");
    }
}
