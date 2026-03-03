package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.ProductDTO;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.model.Product;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.model.Wishlist;
import com.swerrv.swerrv.repository.ProductRepository;
import com.swerrv.swerrv.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<ProductDTO> getWishlist(User user) {
        Wishlist wishlist = getOrCreateWishlist(user);
        return wishlist.getProducts().stream()
                .map(productService::toDTO)
                .toList();
    }

    @Transactional
    public List<ProductDTO> addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Wishlist wishlist = getOrCreateWishlist(user);

        boolean alreadyPresent = wishlist.getProducts().stream()
                .anyMatch(p -> p.getId().equals(productId));

        if (!alreadyPresent) {
            wishlist.getProducts().add(product);
            wishlistRepository.save(wishlist);
        }

        return wishlist.getProducts().stream().map(productService::toDTO).toList();
    }

    @Transactional
    public List<ProductDTO> removeFromWishlist(User user, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(user);
        boolean removed = wishlist.getProducts().removeIf(p -> p.getId().equals(productId));
        if (!removed) {
            throw new BadRequestException("Product is not in your wishlist");
        }
        wishlistRepository.save(wishlist);
        return wishlist.getProducts().stream().map(productService::toDTO).toList();
    }

    private Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUserId(user.getId()).orElseGet(() -> {
            Wishlist w = Wishlist.builder().user(user).build();
            return wishlistRepository.save(w);
        });
    }
}
