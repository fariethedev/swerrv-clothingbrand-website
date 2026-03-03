package com.swerrv.swerrv.repository;

import com.swerrv.swerrv.model.Cart;
import com.swerrv.swerrv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);

    Optional<Cart> findByUserId(Long userId);
}
