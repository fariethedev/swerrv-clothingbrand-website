package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.CreateOrderRequest;
import com.swerrv.swerrv.dto.OrderDTO;
import com.swerrv.swerrv.dto.OrderItemDTO;
import com.swerrv.swerrv.dto.PagedResponse;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.exception.UnauthorizedException;
import com.swerrv.swerrv.model.*;
import com.swerrv.swerrv.repository.CartRepository;
import com.swerrv.swerrv.repository.OrderRepository;
import com.swerrv.swerrv.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final CartRepository cartRepository;
        private final ProductRepository productRepository;
        private final CartService cartService;
        private final StripeService stripeService;
        private final ShippingService shippingService;
        private final EmailService emailService;

        // ── Create Order from Cart ────────────────────────────────────────────────

        @Transactional
        public OrderDTO createOrder(User user, CreateOrderRequest request) {
                Cart cart = cartRepository.findByUser(user)
                                .orElseThrow(() -> new BadRequestException("Cart not found"));

                // Verify Stripe payment
                if ("card".equalsIgnoreCase(request.getPaymentMethod())) {
                        if (request.getPaymentIntentId() == null || request.getPaymentIntentId().isEmpty()) {
                                throw new BadRequestException("PaymentIntent ID is required for card payments");
                        }
                        boolean isPaid = stripeService.verifyPayment(request.getPaymentIntentId());
                        if (!isPaid) {
                                throw new BadRequestException("Payment verification failed.");
                        }
                }

                if (cart.getItems().isEmpty()) {
                        throw new BadRequestException("Cannot create order with an empty cart");
                }

                // Re-validate stock and decrement atomically
                for (CartItem ci : cart.getItems()) {
                        Product p = ci.getProduct();
                        if (p.getStock() < ci.getQuantity()) {
                                throw new BadRequestException(
                                                "\"" + p.getName() + "\" only has " + p.getStock()
                                                                + " items left in stock");
                        }
                        p.setStock(p.getStock() - ci.getQuantity());
                        productRepository.save(p);
                }

                // Build order items from cart
                List<OrderItem> orderItems = cart.getItems().stream().map(ci -> {
                        Product p = ci.getProduct();
                        BigDecimal effectivePrice = p.getSalePrice() != null ? p.getSalePrice() : p.getPrice();
                        return OrderItem.builder()
                                        .productId(p.getId())
                                        .productName(p.getName())
                                        .productPrice(effectivePrice)
                                        .productImage(p.getImages().isEmpty() ? null : p.getImages().get(0))
                                        .size(ci.getSize())
                                        .color(ci.getColor())
                                        .quantity(ci.getQuantity())
                                        .build();
                }).toList();

                BigDecimal subtotal = orderItems.stream()
                                .map(oi -> oi.getProductPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                boolean isLublin = "Lublin".equalsIgnoreCase(request.getShippingAddress().getCity())
                                && "Poland".equalsIgnoreCase(request.getShippingAddress().getCountry());

                BigDecimal shippingCost = isLublin
                                ? BigDecimal.ZERO
                                : new BigDecimal("8.99");

                BigDecimal total = subtotal.add(shippingCost);

                Order order = Order.builder()
                                .user(user)
                                .subtotal(subtotal)
                                .shippingCost(shippingCost)
                                .total(total)
                                .shippingAddress(request.getShippingAddress())
                                .paymentMethod(request.getPaymentMethod())
                                .paymentReference(request.getPaymentReference())
                                .paymentIntentId(request.getPaymentIntentId())
                                .status(OrderStatus.CONFIRMED)
                                .build();

                // Link order items
                orderItems.forEach(oi -> oi.setOrder(order));
                order.getItems().addAll(orderItems);

                // Assign tracking info
                shippingService.generateShippingLabel(order);

                Order saved = orderRepository.save(order);

                // Clear cart after successful order
                cartService.clearCart(user);

                // Send Mock Confirmation Email
                try {
                        emailService.sendOrderConfirmation(saved);
                } catch (Exception e) {
                        // Log but don't fail the order if email fails
                        System.err.println("Failed to send order email: " + e.getMessage());
                }

                return toDTO(saved);
        }

        // ── User: Get My Orders ───────────────────────────────────────────────────

        public PagedResponse<OrderDTO> getMyOrders(User user, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
                return toPagedResponse(orderPage);
        }

        public OrderDTO getMyOrderById(User user, Long orderId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

                if (!order.getUser().getId().equals(user.getId())) {
                        throw new UnauthorizedException("You do not have access to this order");
                }
                return toDTO(order);
        }

        // ── Admin: Get All Orders ─────────────────────────────────────────────────

        public PagedResponse<OrderDTO> getAllOrders(int page, int size) {
                Page<Order> orderPage = orderRepository.findAllByOrderByCreatedAtDesc(
                                PageRequest.of(page, size));
                return toPagedResponse(orderPage);
        }

        @Transactional
        public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

                OrderStatus previous = order.getStatus();
                order.setStatus(status);

                // Restore stock when an order is cancelled or refunded
                boolean wasActive = previous != OrderStatus.CANCELLED && previous != OrderStatus.REFUNDED;
                boolean nowClosed = status == OrderStatus.CANCELLED || status == OrderStatus.REFUNDED;
                if (wasActive && nowClosed) {
                        for (OrderItem oi : order.getItems()) {
                                productRepository.findById(oi.getProductId()).ifPresent(p -> {
                                        p.setStock(p.getStock() + oi.getQuantity());
                                        productRepository.save(p);
                                });
                        }
                }

                return toDTO(orderRepository.save(order));
        }

        // ── Mappers ───────────────────────────────────────────────────────────────

        public OrderDTO toDTO(Order order) {
                List<OrderItemDTO> itemDTOs = order.getItems().stream()
                                .map(oi -> OrderItemDTO.builder()
                                                .id(oi.getId())
                                                .productId(oi.getProductId())
                                                .productName(oi.getProductName())
                                                .productImage(oi.getProductImage())
                                                .productPrice(oi.getProductPrice())
                                                .size(oi.getSize())
                                                .color(oi.getColor())
                                                .quantity(oi.getQuantity())
                                                .lineTotal(oi.getProductPrice()
                                                                .multiply(BigDecimal.valueOf(oi.getQuantity())))
                                                .build())
                                .toList();

                return OrderDTO.builder()
                                .id(order.getId())
                                .userId(order.getUser().getId())
                                .userEmail(order.getUser().getEmail())
                                .items(itemDTOs)
                                .status(order.getStatus())
                                .subtotal(order.getSubtotal())
                                .shippingCost(order.getShippingCost())
                                .total(order.getTotal())
                                .shippingAddress(order.getShippingAddress())
                                .paymentMethod(order.getPaymentMethod())
                                .paymentReference(order.getPaymentReference())
                                .paymentIntentId(order.getPaymentIntentId())
                                .trackingNumber(order.getTrackingNumber())
                                .courier(order.getCourier())
                                .shippingLabelUrl(order.getShippingLabelUrl())
                                .createdAt(order.getCreatedAt())
                                .build();
        }

        private PagedResponse<OrderDTO> toPagedResponse(Page<Order> page) {
                return PagedResponse.<OrderDTO>builder()
                                .content(page.getContent().stream().map(this::toDTO).toList())
                                .page(page.getNumber())
                                .size(page.getSize())
                                .totalElements(page.getTotalElements())
                                .totalPages(page.getTotalPages())
                                .last(page.isLast())
                                .build();
        }
}
