package com.swerrv.swerrv;

import com.swerrv.swerrv.controller.AdminController;
import com.swerrv.swerrv.dto.ProductDTO;
import com.swerrv.swerrv.model.Product;
import com.swerrv.swerrv.repository.ProductRepository;
import com.swerrv.swerrv.security.JwtUtil;
import com.swerrv.swerrv.security.SecurityConfig;
import com.swerrv.swerrv.service.AdminService;
import com.swerrv.swerrv.service.OrderService;
import com.swerrv.swerrv.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@Import(SecurityConfig.class)
public class AdminStockUpdateTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @MockBean
    private OrderService orderService;

    @MockBean
    private com.swerrv.swerrv.service.NewsletterService newsletterService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    // ── Controller Tests ──────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanUpdateStock() throws Exception {
        ProductDTO productDTO = ProductDTO.builder()
                .id(1L)
                .name("T-Shirt")
                .stock(20)
                .build();

        when(adminService.updateStock(eq(1L), eq(20))).thenReturn(productDTO);

        mockMvc.perform(patch("/api/admin/products/1/stock")
                        .param("quantity", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.stock").value(20));

        verify(adminService, times(1)).updateStock(1L, 20);
    }

    @Test
    @WithMockUser(roles = "USER")
    void userCannotUpdateStock() throws Exception {
        mockMvc.perform(patch("/api/admin/products/1/stock")
                        .param("quantity", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(adminService, never()).updateStock(any(), anyInt());
    }

    @Test
    void unauthenticatedCannotUpdateStock() throws Exception {
        mockMvc.perform(patch("/api/admin/products/1/stock")
                        .param("quantity", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(adminService, never()).updateStock(any(), anyInt());
    }

    // ── Service Tests ─────────────────────────────────────────────────────────

    @Test
    void serviceUpdatesStockCorrectly() {
        ProductRepository productRepository = mock(ProductRepository.class);
        ProductService productService = mock(ProductService.class);
        
        AdminService adminServiceTest = new AdminService(
                mock(com.swerrv.swerrv.repository.UserRepository.class),
                productRepository,
                productService,
                mock(com.swerrv.swerrv.repository.OrderRepository.class),
                orderService
        );

        Product product = Product.builder()
                .id(1L)
                .name("T-Shirt")
                .stock(10)
                .build();

        ProductDTO productDTO = ProductDTO.builder()
                .id(1L)
                .name("T-Shirt")
                .stock(15)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productService.toDTO(any(Product.class))).thenReturn(productDTO);

        ProductDTO result = adminServiceTest.updateStock(1L, 15);

        assertThat(result.getStock()).isEqualTo(15);
        verify(productRepository).save(argThat(p -> p.getStock() == 15));
    }

    @Test
    void serviceHandlesNegativeStockAsZero() {
        ProductRepository productRepository = mock(ProductRepository.class);
        ProductService productService = mock(ProductService.class);
        
        AdminService adminServiceTest = new AdminService(
                mock(com.swerrv.swerrv.repository.UserRepository.class),
                productRepository,
                productService,
                mock(com.swerrv.swerrv.repository.OrderRepository.class),
                orderService
        );

        Product product = Product.builder()
                .id(1L)
                .name("T-Shirt")
                .stock(10)
                .build();

        ProductDTO productDTO = ProductDTO.builder()
                .id(1L)
                .name("T-Shirt")
                .stock(0)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productService.toDTO(any(Product.class))).thenReturn(productDTO);

        ProductDTO result = adminServiceTest.updateStock(1L, -5);

        assertThat(result.getStock()).isEqualTo(0);
        verify(productRepository).save(argThat(p -> p.getStock() == 0));
    }
}
