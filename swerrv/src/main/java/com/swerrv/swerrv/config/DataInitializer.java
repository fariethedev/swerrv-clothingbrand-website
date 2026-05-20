package com.swerrv.swerrv.config;

import org.springframework.jdbc.core.JdbcTemplate;
import com.swerrv.swerrv.model.*;
import com.swerrv.swerrv.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final CartRepository cartRepository;
        private final WishlistRepository wishlistRepository;
        private final PasswordEncoder passwordEncoder;
        private final JdbcTemplate jdbcTemplate;

        @Override
        @Transactional
        public void run(String... args) {
                // Clear dependencies to prevent foreign key errors when wiping products
                jdbcTemplate.execute("DELETE FROM order_items");
                jdbcTemplate.execute("DELETE FROM orders");
                jdbcTemplate.execute("DELETE FROM cart_items");
                jdbcTemplate.execute("DELETE FROM wishlist_products");

                // Now safe to wipe products
                productRepository.deleteAllInBatch();

                // Ensure image_url can hold massive Base64 strings
                jdbcTemplate.execute("ALTER TABLE product_images MODIFY image_url LONGTEXT");

                seedUsers();
                seedProducts();
                log.info("✅ Wiped all existing products and re-seeded them.");
        }

        // ── Users ─────────────────────────────────────────────────────────────────

        private void seedUsers() {
                if (userRepository.existsByEmail("admin@swerrv.com"))
                        return;

                // Admin user
                User admin = userRepository.save(User.builder()
                                .firstName("Admin")
                                .lastName("Swerrv")
                                .email("admin@swerrv.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(Role.ADMIN)
                                .build());
                cartRepository.save(Cart.builder().user(admin).build());
                wishlistRepository.save(Wishlist.builder().user(admin).build());

                // Demo customer
                User customer = userRepository.save(User.builder()
                                .firstName("Alex")
                                .lastName("Johnson")
                                .email("alex@example.com")
                                .password(passwordEncoder.encode("password123"))
                                .role(Role.USER)
                                .build());
                cartRepository.save(Cart.builder().user(customer).build());
                wishlistRepository.save(Wishlist.builder().user(customer).build());

                log.info("✅ Seeded admin (admin@swerrv.com / admin123) and demo customer");
        }

        // ── Products ──────────────────────────────────────────────────────────────

        private void seedProducts() {
                if (productRepository.count() > 0)
                        return;

                List<Product> products = List.of(
                                Product.builder()
                                                .name("Swerrv Classic Black Tee")
                                                .slug("swerrv-classic-black-tee")
                                                .description("Premium heavyweight black cotton t-shirt with signature Swerrv minimalist chest print. Made from 100% organic cotton.")
                                                .price(new BigDecimal("44.99"))
                                                .category("T-Shirts")
                                                .images(List.of("/images/_DSC7934.jpg"))
                                                .sizes(List.of("XS", "S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black"))
                                                .stock(100)
                                                .featured(true)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Classic White Tee")
                                                .slug("swerrv-classic-white-tee")
                                                .description("Premium heavyweight white cotton t-shirt with signature Swerrv minimalist chest print. Made from 100% organic cotton.")
                                                .price(new BigDecimal("44.99"))
                                                .category("T-Shirts")
                                                .images(List.of("/images/_DSC7916.jpg"))
                                                .sizes(List.of("XS", "S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("White"))
                                                .stock(100)
                                                .featured(true)
                                                .build()
                );

                for (Product product : products) {
                        if (!"T-Shirts".equals(product.getCategory())) {
                                product.setComingSoon(true);
                        }
                }

                productRepository.saveAll(products);
                log.info("✅ Seeded {} products", products.size());
        }
}
