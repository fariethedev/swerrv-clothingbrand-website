package com.swerrv.swerrv.controller;

import com.swerrv.swerrv.model.PromoContent;
import com.swerrv.swerrv.service.PromoContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promo-content")
@RequiredArgsConstructor
public class PromoContentController {

    private final PromoContentService promoContentService;

    // Public endpoint
    @GetMapping("/active")
    public ResponseEntity<List<PromoContent>> getActiveContent(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(promoContentService.getActivePromoContentByType(type));
        }
        // Ideally we fetch all active, but for simplicity, let's just return all for
        // admin if needed
        return ResponseEntity
                .ok(promoContentService.getAllPromoContent().stream().filter(PromoContent::isActive).toList());
    }

    // Admin endpoints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromoContent>> getAllContent() {
        return ResponseEntity.ok(promoContentService.getAllPromoContent());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoContent> createContent(@RequestBody PromoContent content) {
        return ResponseEntity.ok(promoContentService.createPromoContent(content));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoContent> updateContent(@PathVariable Long id, @RequestBody PromoContent content) {
        return ResponseEntity.ok(promoContentService.updatePromoContent(id, content));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        promoContentService.deletePromoContent(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoContent> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(promoContentService.toggleActiveStatus(id));
    }
}
