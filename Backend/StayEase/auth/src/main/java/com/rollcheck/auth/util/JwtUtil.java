//package com.rollcheck.auth.util;
//
//import io.jsonwebtoken.*;
//import org.springframework.stereotype.Component;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final String SECRET = "mysecretkey";
//
//    public String generateToken(String username, String role) {
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("role", role)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
//                .signWith(SignatureAlgorithm.HS256, SECRET)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//        return getClaims(token).getSubject();
//    }
//
//    public String extractRole(String token) {
//        return getClaims(token).get("role").toString();
//    }
//
//    private Claims getClaims(String token) {
//        return Jwts.parser()
//                .setSigningKey(SECRET)
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}