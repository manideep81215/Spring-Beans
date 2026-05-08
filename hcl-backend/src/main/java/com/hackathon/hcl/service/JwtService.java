package com.hackathon.hcl.service;

import com.hackathon.hcl.exception.BadRequestException;
import com.hackathon.hcl.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;
    private final Set<String> invalidatedTokens = ConcurrentHashMap.newKeySet();

    public JwtService(
            @Value("${app.jwt.secret:change-this-secret-key-for-hcl-hackathon-minimum-32-characters}") String secret,
            @Value("${app.jwt.expiration-ms:3600000}") long expirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("phone", user.getPhone())
                .claim("mobileNumber", user.getPhone())
                .claim("name", user.getFirstName() + " " + user.getLastName())
                .claim("role", user.getRole())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    public Integer extractUserId(String authorizationHeader) {
        Claims claims = extractClaims(authorizationHeader);
        return Integer.valueOf(claims.getSubject());
    }

    public Claims extractClaims(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        if (isTokenInvalidated(token)) {
            throw new BadRequestException("Token is no longer valid");
        }
        return parseClaims(token);
    }

    public boolean isValid(String token) {
        if (token == null || token.isBlank() || isTokenInvalidated(token)) {
            return false;
        }
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().toInstant().isAfter(Instant.now());
        } catch (RuntimeException ex) {
            return false;
        }
    }

    public void invalidateToken(String authorizationHeader) {
        invalidatedTokens.add(extractToken(authorizationHeader));
    }

    public String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new BadRequestException("Authorization header must contain a Bearer token");
        }
        return authorizationHeader.substring(7);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenInvalidated(String token) {
        return invalidatedTokens.contains(token);
    }
}
