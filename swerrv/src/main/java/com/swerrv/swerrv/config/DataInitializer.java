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

                                // ─── Hoodies ───────────────────────────────────────────────────────
                                Product.builder()
                                                .name("Swerrv Classic Logo Hoodie")
                                                .slug("swerrv-classic-logo-hoodie")
                                                .description(
                                                                "Our signature heavyweight fleece hoodie with the iconic Swerrv logo embroidered on the chest. Made from 400g French terry cotton for unmatched warmth.")
                                                .price(new BigDecimal("89.99"))
                                                .salePrice(new BigDecimal("69.99"))
                                                .category("Hoodies")
                                                .images(List.of(
                                                                "/images/_DSC7874.jpg",
                                                                "/images/_DSC8364.jpg",
                                                                "/images/_DSC7876.jpg",
                                                                "/images/_DSC7889.jpg"))
                                                .sizes(List.of("XS", "S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black", "White", "Charcoal", "Olive"))
                                                .stock(150)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Oversized Zip Hoodie")
                                                .slug("swerrv-oversized-zip-hoodie")
                                                .description(
                                                                "Relaxed oversized fit zip-up hoodie with a dropped shoulder construction. Premium brushed fleece interior.")
                                                .price(new BigDecimal("99.99"))
                                                .category("Hoodies")
                                                .images(List.of(
                                                                "/images/_DSC7881.jpg",
                                                                "/images/_DSC7893.jpg",
                                                                "/images/_DSC7953.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Cream", "Stone", "Forest Green"))
                                                .stock(80)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Feelings Mutual Essential Tee")
                                                .slug("feelings-mutual-essential-tee")
                                                .description(
                                                                "Limited edition T-shirt from the 'Feelings Mutual' campaign. 100% heavy cotton, oversized fit, featuring the iconic script branding on the front.")
                                                .price(new BigDecimal("185.00"))
                                                .category("T-Shirts")
                                                .images(List.of(
                                                                "/images/_DSC8141.jpg",
                                                                "/images/_DSC8144.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL"))
                                                .colors(List.of("Black", "White"))
                                                .stock(100)
                                                .featured(true)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Essential Tee")
                                                .slug("swerrv-essential-tee")
                                                .description(
                                                                "240gsm heavyweight cotton tee. Pre-shrunk, garment-dyed for a vintage look and feel. The perfect everyday staple.")
                                                .price(new BigDecimal("44.99"))
                                                .category("T-Shirts")
                                                .images(List.of(
                                                                "/images/_DSC7934.jpg",
                                                                "/images/_DSC7916.jpg",
                                                                "/images/_DSC7962.jpg"))
                                                .sizes(List.of("XS", "S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black", "White", "Washed Blue", "Rust", "Sand"))
                                                .stock(200)
                                                .featured(true)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Graphic Statement Tee")
                                                .slug("swerrv-graphic-statement-tee")
                                                .description(
                                                                "Screen-printed graphic on a 100% organic cotton body. Bold street-art inspired design exclusive to Swerrv.")
                                                .price(new BigDecimal("54.99"))
                                                .salePrice(new BigDecimal("39.99"))
                                                .category("T-Shirts")
                                                .images(List.of(
                                                                "/images/_DSC7995.jpg",
                                                                "/images/_DSC7998.jpg",
                                                                "/images/_DSC8014.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL"))
                                                .colors(List.of("Black", "White"))
                                                .stock(120)
                                                .featured(false)
                                                .build(),

                                // ─── Joggers ──────────────────────────────────────────────────────
                                Product.builder()
                                                .name("Swerrv Tech Fleece Joggers")
                                                .slug("swerrv-tech-fleece-joggers")
                                                .description(
                                                                "Engineered tech fleece joggers with tapered fit, zip pockets, and elastic cuffs. Perfect for training or lounging.")
                                                .price(new BigDecimal("79.99"))
                                                .category("Joggers")
                                                .images(List.of(
                                                                "/images/_DSC8019.jpg",
                                                                "/images/_DSC8023.jpg",
                                                                "/images/_DSC8055.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black", "Charcoal", "Navy"))
                                                .stock(100)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Cargo Joggers")
                                                .slug("swerrv-cargo-joggers")
                                                .description(
                                                                "Utility cargo joggers with six functional pockets, adjustable waist, and a relaxed tapered silhouette.")
                                                .price(new BigDecimal("84.99"))
                                                .category("Joggers")
                                                .images(List.of(
                                                                "/images/_DSC8041.jpg",
                                                                "/images/_DSC8059.jpg",
                                                                "/images/_DSC8072.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL"))
                                                .colors(List.of("Olive", "Black", "Khaki"))
                                                .stock(75)
                                                .featured(false)
                                                .build(),

                                // ─── Jackets ──────────────────────────────────────────────────────
                                Product.builder()
                                                .name("Swerrv Coaches Jacket")
                                                .slug("swerrv-coaches-jacket")
                                                .description(
                                                                "Lightweight nylon coaches jacket with snap buttons, chest pocket, and embroidered Swerrv branding. Water-resistant shell.")
                                                .price(new BigDecimal("129.99"))
                                                .category("Jackets")
                                                .images(List.of(
                                                                "/images/_DSC8141.jpg",
                                                                "/images/_DSC8136.jpg",
                                                                "/images/_DSC8144.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black", "Navy", "Olive", "Burgundy"))
                                                .stock(60)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Puffer Vest")
                                                .slug("swerrv-puffer-vest")
                                                .description(
                                                                "Insulated puffer vest with 600-fill goose down, stand collar, and Swerrv logo zipper pulls.")
                                                .price(new BigDecimal("109.99"))
                                                .category("Jackets")
                                                .images(List.of(
                                                                "/images/_DSC8211.jpg",
                                                                "/images/_DSC8199.jpg",
                                                                "/images/_DSC8220.jpg",
                                                                "/images/_DSC8221.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL"))
                                                .colors(List.of("Black", "Cream", "Slate Blue"))
                                                .stock(45)
                                                .featured(false)
                                                .build(),

                                // ─── Accessories ──────────────────────────────────────────────────
                                Product.builder()
                                                .name("Swerrv Dad Hat")
                                                .slug("swerrv-dad-hat")
                                                .description(
                                                                "Unstructured 6-panel dad hat with embroidered Swerrv wordmark. Adjustable strap closure. One size fits all.")
                                                .price(new BigDecimal("34.99"))
                                                .category("Accessories")
                                                .images(List.of(
                                                                "/images/_DSC8300.jpg",
                                                                "/images/_DSC8294.jpg",
                                                                "/images/_DSC8296.jpg",
                                                                "/images/_DSC8302.jpg"))
                                                .sizes(List.of("One Size"))
                                                .colors(List.of("Black", "White", "Tan", "Forest", "Navy"))
                                                .stock(300)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Logo Socks (3-Pack)")
                                                .slug("swerrv-logo-socks-3-pack")
                                                .description(
                                                                "Mid-calf crew socks made from 80% combed cotton with Swerrv branding on the ankle. Pack of 3 pairs.")
                                                .price(new BigDecimal("24.99"))
                                                .category("Accessories")
                                                .images(List.of(
                                                                "/images/_DSC8400.jpg",
                                                                "/images/_DSC8402.jpg",
                                                                "/images/_DSC8407.jpg",
                                                                "/images/_DSC8413.jpg"))
                                                .sizes(List.of("S/M", "L/XL"))
                                                .colors(List.of("Black", "White", "Multi"))
                                                .stock(500)
                                                .featured(false)
                                                .build(),

                                // ─── Crewnecks ────────────────────────────────────────────────────
                                Product.builder()
                                                .name("Swerrv Essential Crewneck")
                                                .slug("swerrv-essential-crewneck")
                                                .description(
                                                                "Midweight French terry crewneck with a relaxed fit and ribbed cuffs and hem. Soft interior brushed for comfort.")
                                                .price(new BigDecimal("74.99"))
                                                .category("Crewnecks")
                                                .images(List.of(
                                                                "/images/_DSC8470.jpg",
                                                                "/images/_DSC8446.jpg",
                                                                "/images/_DSC8438.jpg",
                                                                "/images/_DSC8433.jpg"))
                                                .sizes(List.of("XS", "S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black", "Oat", "Washed Grey", "Dusty Pink"))
                                                .stock(110)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Arch Logo Crewneck")
                                                .slug("swerrv-arch-logo-crewneck")
                                                .description(
                                                                "Premium 420gsm loopback cotton crewneck with large arc-style Swerrv chest graphic. Garment washed for a worn-in look.")
                                                .price(new BigDecimal("84.99"))
                                                .salePrice(new BigDecimal("64.99"))
                                                .category("Crewnecks")
                                                .images(List.of(
                                                                "/images/_DSC8257.jpg",
                                                                "/images/_DSC8246.jpg",
                                                                "/images/_DSC8258.jpg",
                                                                "/images/_DSC8276.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Vintage Black", "Washed Brown"))
                                                .stock(90)
                                                .featured(false)
                                                .build(),

                                // ─── Classic Collection ──────────────────────────────────────────
                                Product.builder()
                                                .name("Swerrv Classic Cap")
                                                .slug("swerrv-classic-cap")
                                                .description(
                                                                "Premium black dad hat featuring signature minimalist embroidery. A subtle homage to streetwear culture.")
                                                .price(new BigDecimal("39.99"))
                                                .category("Accessories")
                                                .images(List.of(
                                                                "/images/_DSC8088.jpg"))
                                                .sizes(List.of("One Size"))
                                                .colors(List.of("Black", "Forest Green"))
                                                .stock(400)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Classic Bomber")
                                                .slug("swerrv-classic-bomber")
                                                .description(
                                                                "Oversized black bomber jacket with extremely understated embroidery on the chest. Perfect silhouette and luxury feel.")
                                                .price(new BigDecimal("149.99"))
                                                .category("Jackets")
                                                .images(List.of(
                                                                "/images/_DSC8141.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Black"))
                                                .stock(100)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Classic Cargos")
                                                .slug("swerrv-classic-cargos")
                                                .description(
                                                                "Heavyweight olive cargos featuring a minimalist tag near the left knee pocket. Loose fit, adjustable waist and hem.")
                                                .price(new BigDecimal("89.99"))
                                                .category("Joggers")
                                                .images(List.of(
                                                                "/images/_DSC8041.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Olive Green", "Black"))
                                                .stock(80)
                                                .featured(false)
                                                .build(),

                                Product.builder()
                                                .name("Swerrv Classic Graphic Tee")
                                                .slug("swerrv-classic-graphic-tee")
                                                .description(
                                                                "Vintage washed grey tee with a large artistic representation peeling on the back. A loud piece with a quiet inspiration.")
                                                .price(new BigDecimal("49.99"))
                                                .category("T-Shirts")
                                                .images(List.of(
                                                                "/images/_DSC7934.jpg"))
                                                .sizes(List.of("S", "M", "L", "XL", "XXL"))
                                                .colors(List.of("Washed Grey", "Vintage Black"))
                                                .stock(150)
                                                .featured(true)
                                                .build());

                for (Product product : products) {
                        if (!"T-Shirts".equals(product.getCategory())) {
                                product.setComingSoon(true);
                        }
                }

                productRepository.saveAll(products);
                log.info("✅ Seeded {} products", products.size());
        }
}
