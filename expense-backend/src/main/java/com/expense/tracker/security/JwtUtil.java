package com.expense.tracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.security.Key;

public class JwtUtil {

    // fixed secret key
    private static final String SECRET =
            "mySuperSecretKeyForExpenseTrackerJwtAuthentication123456";

    private static final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // 24 HOURS
    private static final long EXPIRATION =
            1000 * 60 * 60;

    // GENERATE TOKEN
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // EXTRACT USERNAME
    public static String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // EXTRACT EXPIRY
    public static Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    // CHECK TOKEN EXPIRY
    public static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // VALIDATE TOKEN
    public static boolean validateToken(String token, String username) {
        return extractUsername(token).equals(username)
                && !isTokenExpired(token);
    }

    // GET CLAIMS
    private static Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}