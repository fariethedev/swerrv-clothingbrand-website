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

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@Import(SecurityConfig.class)
public class LowStockNotificationTests {

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
    void adminCanGetLowStockProducts() throws Exception {
        ProductDTO lowStockProduct = ProductDTO.builder()
                .id(1L)
                .name("Low Stock T-Shirt")
                .stock(3)
                .build();

        when(adminService.getLowStockProducts(eq(5))).thenReturn(List.of(lowStockProduct));

        mockMvc.perform(get("/api/admin/products/low-stock")
                        .param("threshold", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].stock").value(3));

        verify(adminService, times(1)).getLowStockProducts(5);
    }

    @Test
    @WithMockUser(roles = "USER")
    void userCannotGetLowStockProducts() throws Exception {
        mockMvc.perform(get("/api/admin/products/low-stock")
                        .param("threshold", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // ── Service Tests ─────────────────────────────────────────────────────────

    @Test
    void serviceRetrievesLowStockProductsCorrectly() {
        ProductRepository productRepository = mock(ProductRepository.class);
        ProductService productService = mock(ProductService.class);
        
        AdminService adminServiceTest = new AdminService(
                mock(com.swerrv.swerrv.repository.UserRepository.class),
                productRepository,
                productService,
                mock(com.swerrv.swerrv.repository.OrderRepository.class),
                orderService
        );

        Product lowStockProduct = Product.builder()
                .id(1L)
                .name("Low Stock Product")
                .stock(3)
                .active(true)
                .build();

        ProductDTO productDTO = ProductDTO.builder()
                .id(1L)
                .name("Low Stock Product")
                .stock(3)
                .build();

        when(productRepository.findByStockLessThanEqualAndActiveTrue(5)).thenReturn(List.of(lowStockProduct));
        when(productService.toDTO(any(Product.class))).thenReturn(productDTO);

        List<ProductDTO> results = adminServiceTest.getLowStockProducts(5);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStock()).isEqualTo(3);
        verify(productRepository).findByStockLessThanEqualAndActiveTrue(5);
    }
}
