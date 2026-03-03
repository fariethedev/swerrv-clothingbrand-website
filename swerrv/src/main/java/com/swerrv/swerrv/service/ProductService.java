package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.PagedResponse;
import com.swerrv.swerrv.dto.ProductCreateDTO;
import com.swerrv.swerrv.dto.ProductDTO;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.model.Product;
import com.swerrv.swerrv.repository.ProductRepository;
import com.swerrv.swerrv.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    // ── Read Operations ──────────────────────────────────────────────────────

    public PagedResponse<ProductDTO> getProducts(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        Page<Product> productPage = productRepository.findByActiveTrue(pageable);
        return toPagedResponse(productPage);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return toDTO(product);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return toDTO(product);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue()
                .stream().map(this::toDTO).toList();
    }

    public List<String> getCategories() {
        return productRepository.findAllCategories();
    }

    public PagedResponse<ProductDTO> searchProducts(
            String query, String category, BigDecimal minPrice,
            BigDecimal maxPrice, int page, int size, String sort) {

        Pageable pageable = buildPageable(page, size, sort);
        Page<Product> result = productRepository.searchProducts(
                query, category, minPrice, maxPrice, pageable);
        return toPagedResponse(result);
    }

    // ── Write Operations (Admin) ─────────────────────────────────────────────

    @Transactional
    public ProductDTO createProduct(ProductCreateDTO dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .slug(generateSlug(dto.getName()))
                .description(dto.getDescription())
                .material(dto.getMaterial())
                .price(dto.getPrice())
                .salePrice(dto.getSalePrice())
                .category(dto.getCategory())
                .images(dto.getImages() != null ? dto.getImages() : List.of())
                .sizes(dto.getSizes() != null ? dto.getSizes() : List.of())
                .colors(dto.getColors() != null ? dto.getColors() : List.of())
                .stock(dto.getStock())
                .featured(dto.isFeatured())
                .isNew(dto.isNew())
                .comingSoon(dto.isComingSoon())
                .build();

        return toDTO(productRepository.save(product));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        product.setName(dto.getName());
        product.setSlug(generateSlug(dto.getName()));
        product.setDescription(dto.getDescription());
        product.setMaterial(dto.getMaterial());
        product.setPrice(dto.getPrice());
        product.setSalePrice(dto.getSalePrice());
        product.setCategory(dto.getCategory());
        if (dto.getImages() != null)
            product.setImages(dto.getImages());
        if (dto.getSizes() != null)
            product.setSizes(dto.getSizes());
        if (dto.getColors() != null)
            product.setColors(dto.getColors());
        product.setStock(dto.getStock());
        product.setFeatured(dto.isFeatured());
        product.setNew(dto.isNew());
        product.setComingSoon(dto.isComingSoon());

        return toDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setActive(false);
        productRepository.save(product);
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    public ProductDTO toDTO(Product p) {
        Double avg = reviewRepository.getAverageRatingByProductId(p.getId());
        long count = reviewRepository.countByProductId(p.getId());

        // price = what the customer pays (salePrice if set, else original price)
        // originalPrice = only present when there IS a sale (crossed-out price)
        boolean hasSale = p.getSalePrice() != null && p.getSalePrice().compareTo(p.getPrice()) < 0;
        java.math.BigDecimal displayPrice = hasSale ? p.getSalePrice() : p.getPrice();
        java.math.BigDecimal originalPrice = hasSale ? p.getPrice() : null;

        // Compute tags
        java.util.ArrayList<String> tags = new java.util.ArrayList<>();
        if (p.isNew())
            tags.add("new");
        if (p.isFeatured())
            tags.add("featured");
        if (hasSale)
            tags.add("sale");

        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .material(p.getMaterial())
                .category(p.getCategory())
                .price(displayPrice)
                .originalPrice(originalPrice)
                .image(p.getImages().isEmpty() ? null : p.getImages().get(0))
                .images(p.getImages())
                .sizes(p.getSizes())
                .colors(p.getColors())
                .stock(p.getStock())
                .isFeatured(p.isFeatured())
                .isNew(p.isNew())
                .comingSoon(p.isComingSoon())
                .active(p.isActive())
                .tags(tags)
                .rating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .reviewCount(count)
                .createdAt(p.getCreatedAt())
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private PagedResponse<ProductDTO> toPagedResponse(Page<Product> page) {
        return PagedResponse.<ProductDTO>builder()
                .content(page.getContent().stream().map(this::toDTO).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private Pageable buildPageable(int page, int size, String sort) {
        Sort sortObj = switch (sort != null ? sort : "newest") {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "name" -> Sort.by("name").ascending();
            default -> Sort.by("createdAt").descending();
        };
        return PageRequest.of(page, size, sortObj);
    }

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

    private String generateSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String slug = WHITESPACE.matcher(normalized.toLowerCase(Locale.ENGLISH)).replaceAll("-");
        slug = NON_LATIN.matcher(slug).replaceAll("");
        // Ensure uniqueness by appending timestamp if collision
        String base = slug;
        int attempt = 0;
        while (productRepository.findBySlug(attempt == 0 ? slug : slug + "-" + attempt).isPresent()) {
            attempt++;
            slug = base + "-" + attempt;
        }
        return attempt == 0 ? base : slug;
    }
}
