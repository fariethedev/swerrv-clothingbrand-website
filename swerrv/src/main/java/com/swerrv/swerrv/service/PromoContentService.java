package com.swerrv.swerrv.service;

import com.swerrv.swerrv.model.PromoContent;
import com.swerrv.swerrv.repository.PromoContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromoContentService {

    private final PromoContentRepository promoContentRepository;

    public List<PromoContent> getAllPromoContent() {
        return promoContentRepository.findAll();
    }

    public List<PromoContent> getActivePromoContentByType(String type) {
        return promoContentRepository.findByTypeAndIsActiveTrue(type);
    }

    public PromoContent createPromoContent(PromoContent content) {
        content.setCreatedAt(LocalDateTime.now());
        content.setUpdatedAt(LocalDateTime.now());
        return promoContentRepository.save(content);
    }

    public PromoContent updatePromoContent(Long id, PromoContent updatedContent) {
        return promoContentRepository.findById(id).map(content -> {
            content.setTitle(updatedContent.getTitle());
            content.setType(updatedContent.getType());
            content.setDescription(updatedContent.getDescription());
            content.setMediaUrl(updatedContent.getMediaUrl());
            content.setActionUrl(updatedContent.getActionUrl());
            content.setEventDate(updatedContent.getEventDate());
            content.setLocation(updatedContent.getLocation());
            content.setActive(updatedContent.isActive());
            content.setUpdatedAt(LocalDateTime.now());
            return promoContentRepository.save(content);
        }).orElseThrow(() -> new RuntimeException("Content not found"));
    }

    public void deletePromoContent(Long id) {
        promoContentRepository.deleteById(id);
    }

    public PromoContent toggleActiveStatus(Long id) {
        return promoContentRepository.findById(id).map(content -> {
            content.setActive(!content.isActive());
            content.setUpdatedAt(LocalDateTime.now());
            return promoContentRepository.save(content);
        }).orElseThrow(() -> new RuntimeException("Content not found"));
    }
}
