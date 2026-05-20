package com.swerrv.swerrv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swerrv.swerrv.controller.AuthController;
import com.swerrv.swerrv.controller.AdminController;
import com.swerrv.swerrv.dto.AuthRequest;
import com.swerrv.swerrv.dto.RegisterRequest;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.exception.GlobalExceptionHandler;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.security.JwtUtil;
import com.swerrv.swerrv.security.SecurityConfig;
import com.swerrv.swerrv.service.AuthService;
import com.swerrv.swerrv.service.AdminService;
import com.swerrv.swerrv.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {AuthController.class, AdminController.class})
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
public class SecurityErrorHandlingTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private AdminService adminService;

    @MockBean
    private OrderService orderService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    // ── Validation Constraint Tests ───────────────────────────────────────────

    @Test
    void registerWithBlankEmailOrPasswordReturnsUnprocessableEntity() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail(""); // blank
        request.setPassword("123"); // less than 6 chars

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details.email").exists())
                .andExpect(jsonPath("$.details.password").exists());
    }

    // ── Exception Handling Tests ──────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateStockOfNonExistentProductThrowsResourceNotFoundException() throws Exception {
        when(adminService.updateStock(eq(999L), anyInt()))
                .thenThrow(new ResourceNotFoundException("Product", 999L));

        mockMvc.perform(patch("/api/admin/products/999/stock")
                        .param("quantity", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found with id: 999"));
    }

    @Test
    void badRequestExceptionTranslatesTo400() throws Exception {
        when(authService.login(any(AuthRequest.class)))
                .thenThrow(new BadRequestException("Bad request input details"));

        AuthRequest request = new AuthRequest();
        request.setEmail("test@swerrv.com");
        request.setPassword("password");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Bad request input details"));
    }
}
