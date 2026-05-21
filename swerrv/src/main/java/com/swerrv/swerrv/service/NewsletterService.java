package com.swerrv.swerrv.service;

import com.swerrv.swerrv.exception.BadRequestException;
import com.swerrv.swerrv.exception.ResourceNotFoundException;
import com.swerrv.swerrv.model.NewsletterSubscriber;
import com.swerrv.swerrv.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsletterService {

    private final NewsletterSubscriberRepository subscriberRepository;
    private final EmailService emailService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    @Transactional
    public NewsletterSubscriber subscribe(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email address is required.");
        }
        
        String cleanEmail = email.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(cleanEmail).matches()) {
            throw new BadRequestException("Invalid email address format.");
        }

        return subscriberRepository.findByEmail(cleanEmail)
                .map(existing -> {
                    if (existing.isActive()) {
                        throw new BadRequestException("This email is already subscribed to our newsletter.");
                    }
                    existing.setActive(true);
                    existing.setSubscribedAt(LocalDateTime.now());
                    log.info("Re-activated newsletter subscription for: {}", cleanEmail);
                    return subscriberRepository.save(existing);
                })
                .orElseGet(() -> {
                    NewsletterSubscriber newSubscriber = NewsletterSubscriber.builder()
                            .email(cleanEmail)
                            .active(true)
                            .subscribedAt(LocalDateTime.now())
                            .build();
                    log.info("Registered new newsletter subscription for: {}", cleanEmail);
                    return subscriberRepository.save(newSubscriber);
                });
    }

    @Transactional
    public void unsubscribe(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email address is required.");
        }

        String cleanEmail = email.trim().toLowerCase();
        NewsletterSubscriber subscriber = subscriberRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Subscriber not found with email: " + cleanEmail));

        if (!subscriber.isActive()) {
            log.info("Email is already unsubscribed: {}", cleanEmail);
            return;
        }

        subscriber.setActive(false);
        subscriberRepository.save(subscriber);
        log.info("Unsubscribed email: {}", cleanEmail);
    }

    @Transactional(readOnly = true)
    public List<NewsletterSubscriber> getAllSubscribers() {
        return subscriberRepository.findAll();
    }

    @Transactional
    public void deleteSubscriber(Long id) {
        if (!subscriberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subscriber", id);
        }
        subscriberRepository.deleteById(id);
        log.info("Permanently deleted subscriber with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public void sendNewsletter(String subject, String content) {
        if (subject == null || subject.trim().isEmpty()) {
            throw new BadRequestException("Newsletter subject is required.");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new BadRequestException("Newsletter content is required.");
        }

        List<NewsletterSubscriber> activeSubscribers = subscriberRepository.findByActiveTrue();
        if (activeSubscribers.isEmpty()) {
            log.info("No active newsletter subscribers found. Skip sending.");
            return;
        }

        log.info("Sending newsletter with subject '{}' to {} active subscribers.", subject, activeSubscribers.size());
        for (NewsletterSubscriber subscriber : activeSubscribers) {
            emailService.sendNewsletterEmail(subscriber.getEmail(), subject, content);
        }
    }
}
