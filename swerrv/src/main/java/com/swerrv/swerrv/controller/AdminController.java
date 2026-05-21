package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.dto.AdminDashboardDTO;
import com.swerrv.swerrv.dto.OrderDTO;
import com.swerrv.swerrv.dto.PagedResponse;
import com.swerrv.swerrv.dto.ProductDTO;
import com.swerrv.swerrv.dto.UserDTO;
import com.swerrv.swerrv.model.OrderStatus;
import com.swerrv.swerrv.service.AdminService;
import com.swerrv.swerrv.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    // ── Dashboard ─────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardDTO> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<PagedResponse<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    @RequestMapping(value = "/orders/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // ── Stock Management ──────────────────────────────────────────────────────

    @GetMapping("/products/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts(
            @RequestParam(defaultValue = "5") int threshold) {
        return ResponseEntity.ok(adminService.getLowStockProducts(threshold));
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(adminService.updateStock(id, quantity));
    }

    // ── Newsletter Management ──────────────────────────────────────────────────

    private final com.swerrv.swerrv.service.NewsletterService newsletterService;

    @GetMapping("/newsletter/subscribers")
    public ResponseEntity<List<com.swerrv.swerrv.model.NewsletterSubscriber>> getSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscribers());
    }

    @DeleteMapping("/newsletter/subscribers/{id}")
    public ResponseEntity<java.util.Map<String, String>> deleteSubscriber(@PathVariable Long id) {
        newsletterService.deleteSubscriber(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Subscriber deleted successfully."));
    }

    @PostMapping("/newsletter/send")
    public ResponseEntity<java.util.Map<String, String>> sendNewsletter(
            @jakarta.validation.Valid @RequestBody com.swerrv.swerrv.dto.SendNewsletterRequest request) {
        newsletterService.sendNewsletter(request.getSubject(), request.getContent());
        return ResponseEntity.ok(java.util.Map.of("message", "Newsletter broadcast initiated successfully."));
    }
}
