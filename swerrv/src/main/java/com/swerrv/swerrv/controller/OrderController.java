package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.dto.CreateOrderRequest;
import com.swerrv.swerrv.dto.OrderDTO;
import com.swerrv.swerrv.dto.PagedResponse;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(user, request));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<OrderDTO>> getMyOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getMyOrders(user, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getMyOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMyOrderById(user, id));
    }
}
