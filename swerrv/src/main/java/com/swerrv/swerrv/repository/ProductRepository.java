package com.swerrv.swerrv.repository;

import com.swerrv.swerrv.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

        Optional<Product> findBySlug(String slug);

        List<Product> findByFeaturedTrueAndActiveTrue();

        Page<Product> findByActiveTrue(Pageable pageable);

        Page<Product> findByCategoryAndActiveTrue(String category, Pageable pageable);

        @Query("""
                        SELECT p FROM Product p
                        WHERE p.active = true
                          AND (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
                                              OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
                          AND (:category IS NULL OR p.category = :category)
                          AND (:minPrice IS NULL OR p.price >= :minPrice)
                          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                        """)
        Page<Product> searchProducts(
                        @Param("query") String query,
                        @Param("category") String category,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        Pageable pageable);

        @Query("SELECT DISTINCT p.category FROM Product p WHERE p.active = true ORDER BY p.category")
        List<String> findAllCategories();

        long countByActiveTrue();

        List<Product> findByStockLessThanEqualAndActiveTrue(int threshold);
}
