package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.dto.CreateReviewRequest;
import com.swerrv.swerrv.dto.ReviewDTO;
import com.swerrv.swerrv.model.User;
import com.swerrv.swerrv.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ReviewDTO> createReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(user, productId, request));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.noContent().build();
    }
}
