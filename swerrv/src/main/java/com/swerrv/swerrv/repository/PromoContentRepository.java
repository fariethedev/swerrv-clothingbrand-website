package com.swerrv.swerrv.repository;

import com.swerrv.swerrv.model.PromoContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromoContentRepository extends JpaRepository<PromoContent, Long> {
    List<PromoContent> findByTypeAndIsActiveTrue(String type);
}
