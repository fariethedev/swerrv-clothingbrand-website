package com.swerrv.swerrv.repository;

import com.swerrv.swerrv.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductIdAndSizeAndColor(
            Long cartId, Long productId, String size, String color);

    void deleteByCartId(Long cartId);
}
