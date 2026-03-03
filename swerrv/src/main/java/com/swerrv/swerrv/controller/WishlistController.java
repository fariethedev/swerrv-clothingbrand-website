package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.dto.ProductDTO;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<List<ProductDTO>> addToWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(user, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<List<ProductDTO>> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(user, productId));
    }
}
