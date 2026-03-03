package com.mindspark.api_gateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.security.Key;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtForwardFilter extends OncePerRequestFilter {

    // Keep the same secret as the auth service
    private final String SECRET = "SRPXjyrJ6oxQ4TH9hWJWd2NsEYRG42BhjSsgcNMhQKI=";

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String username = claims.getSubject();
                Object userIdObj = claims.get("userId");
                Object roleObj = claims.get("role");

                Map<String, String> headers = new HashMap<>();
                if (username != null) headers.put("X-Username", username);
                if (userIdObj != null) headers.put("X-User-Id", String.valueOf(userIdObj));
                if (roleObj != null) headers.put("X-User-Role", String.valueOf(roleObj));

                AddHeadersRequestWrapper wrapper = new AddHeadersRequestWrapper(request, headers);
                filterChain.doFilter(wrapper, response);
                return;

            } catch (Exception ex) {
                // token invalid - let request proceed without user headers
            }
        }

        filterChain.doFilter(request, response);
    }
}
