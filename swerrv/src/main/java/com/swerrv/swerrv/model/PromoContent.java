package com.swerrv.swerrv.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // VIDEO, EVENT, NEWS

    private String title;

    private String description;

    private String mediaUrl; // For video URL or Image URL

    private String actionUrl; // For external link or internal route

    private LocalDateTime eventDate; // For events

    private String location; // For events

    private boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
