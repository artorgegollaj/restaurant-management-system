package com.ubt.restaurant.security;

import com.ubt.restaurant.entity.RefreshToken;
import com.ubt.restaurant.entity.User;
import com.ubt.restaurant.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repo;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public RefreshTokenService(RefreshTokenRepository repo) {
        this.repo = repo;
    }

    public RefreshToken create(User user) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(UUID.randomUUID().toString() + "-" + UUID.randomUUID());
        rt.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));
        rt.setRevoked(false);
        return repo.save(rt);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return repo.findByToken(token);
    }

    public boolean isValid(RefreshToken rt) {
        return !rt.isRevoked() && rt.getExpiryDate().isAfter(Instant.now());
    }

    public void revoke(RefreshToken rt) {
        rt.setRevoked(true);
        repo.save(rt);
    }

    public void revokeAll(User user) {
        repo.revokeAllByUser(user);
    }
}
