package com.swerrv.swerrv.repository;

import com.swerrv.swerrv.model.PasswordResetToken;
import com.swerrv.swerrv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenAndUser(String token, User user);

    Optional<PasswordResetToken> findByUser(User user);

    void deleteByUser(User user);
}
