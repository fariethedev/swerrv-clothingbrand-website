package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.AddToCartRequest;
import com.swerrv.swerrv.dto.CartDTO;
import com.swerrv.swerrv.dto.CartItemDTO;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.model.Cart;
import com.swerrv.swerrv.model.CartItem;
import com.swerrv.swerrv.model.Product;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.repository.CartItemRepository;
import com.swerrv.swerrv.repository.CartRepository;
import com.swerrv.swerrv.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    // ── Get Cart ─────────────────────────────────────────────────────────────

    public CartDTO getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return toDTO(cart);
    }

    // ── Add to Cart ───────────────────────────────────────────────────────────

    @Transactional
    public CartDTO addToCart(User user, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("Product is no longer available");
        }
        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
        }

        Cart cart = getOrCreateCart(user);

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductIdAndSizeAndColor(
                cart.getId(), product.getId(),
                request.getSize(), request.getColor());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .size(request.getSize())
                    .color(request.getColor())
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return toDTO(cartRepository.findById(cart.getId()).orElseThrow());
    }

    // ── Update Quantity ───────────────────────────────────────────────────────

    @Transactional
    public CartDTO updateItem(User user, Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Item does not belong to this user's cart");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return toDTO(getOrCreateCart(user));
    }

    // ── Remove Item ───────────────────────────────────────────────────────────

    @Transactional
    public CartDTO removeItem(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Item does not belong to this user's cart");
        }

        cartItemRepository.delete(item);
        return toDTO(getOrCreateCart(user));
    }

    // ── Clear Cart ────────────────────────────────────────────────────────────

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }

    private CartDTO toDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::toItemDTO)
                .toList();

        BigDecimal subtotal = itemDTOs.stream()
                .map(CartItemDTO::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemDTOs)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }

    private CartItemDTO toItemDTO(CartItem item) {
        Product p = item.getProduct();
        BigDecimal effectivePrice = p.getSalePrice() != null ? p.getSalePrice() : p.getPrice();
        BigDecimal lineTotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImage(p.getImages().isEmpty() ? null : p.getImages().get(0))
                .productPrice(p.getPrice())
                .salePriceAt(p.getSalePrice())
                .size(item.getSize())
                .color(item.getColor())
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .build();
    }
}
