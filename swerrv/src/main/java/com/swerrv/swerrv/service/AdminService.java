package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.AdminDashboardDTO;
import com.swerrv.swerrv.dto.OrderDTO;
import com.swerrv.swerrv.dto.ProductDTO;
import com.swerrv.swerrv.dto.UserDTO;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.model.OrderStatus;
import com.swerrv.swerrv.model.Product;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.repository.OrderRepository;
import com.swerrv.swerrv.repository.ProductRepository;
import com.swerrv.swerrv.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    // ── Dashboard Stats ───────────────────────────────────────────────────────

    public AdminDashboardDTO getDashboardStats() {
        List<OrderDTO> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(orderService::toDTO).toList();

        return AdminDashboardDTO.builder()
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING)
                        + orderRepository.countByStatus(OrderStatus.CONFIRMED))
                .totalProducts(productRepository.countByActiveTrue())
                .totalUsers(userRepository.count())
                .totalRevenue(orderRepository.getTotalRevenue())
                .monthlyRevenue(orderRepository.getMonthlyRevenue())
                .recentOrders(recentOrders)
                .build();
    }

    // ── User Management ───────────────────────────────────────────────────────

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserDTO).toList();
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.swerrv.swerrv.exception.ResourceNotFoundException("User", id));
        return toUserDTO(user);
    }

    // ── Stock Management ──────────────────────────────────────────────────────

    public List<ProductDTO> getLowStockProducts(int threshold) {
        return productRepository.findByStockLessThanEqualAndActiveTrue(threshold)
                .stream().map(productService::toDTO).toList();
    }

    public ProductDTO updateStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setStock(Math.max(0, quantity));
        return productService.toDTO(productRepository.save(product));
    }

    // ── Mapper ────────────────────────────────────────────────────────────────

    private UserDTO toUserDTO(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .role(u.getRole())
                .active(u.isActive())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
