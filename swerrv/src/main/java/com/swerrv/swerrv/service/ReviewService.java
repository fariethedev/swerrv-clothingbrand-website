package com.swerrv.swerrv.service;

import com.swerrv.swerrv.dto.CreateReviewRequest;
import com.swerrv.swerrv.dto.ReviewDTO;
import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.model.Product;
import com.swerrv.swerrv.model.Review;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.repository.ProductRepository;
import com.swerrv.swerrv.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public List<ReviewDTO> getProductReviews(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public ReviewDTO createReview(User user, Long productId, CreateReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return toDTO(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only delete your own reviews");
        }
        reviewRepository.delete(review);
    }

    private ReviewDTO toDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .productId(r.getProduct().getId())
                .userId(r.getUser().getId())
                .userFirstName(r.getUser().getFirstName())
                .userLastName(r.getUser().getLastName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
