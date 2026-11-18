package com.property.property_service.controller;


import com.property.property_service.dto.AiResponse;
import com.property.property_service.dto.ChatRequest;
import com.property.property_service.dto.SummarizeRequest;
import com.property.property_service.service.AiService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;


    @PostMapping("/ai/summarize")
    public ResponseEntity<?> summarize(@RequestBody SummarizeRequest req,
                                       HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        if (role == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Authentication required."));
        }
        try {
            String summary = aiService.summarizeProperty(req);
            return ResponseEntity.ok(new AiResponse(summary, "summary"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/ai/recommend")
    public ResponseEntity<?> recommend(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Double maxRent,
            HttpServletRequest request) {

        String role = request.getHeader("X-User-Role");
        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only tenants can get recommendations."));
        }
        try {
            String recommendations = aiService.getRecommendations(city, propertyType, maxRent);
            return ResponseEntity.ok(new AiResponse(recommendations, "recommendation"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /*
      general chatbot — no auth required
      /ai/chat
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest req) {
        try {
            String reply = aiService.chatWithUser(req.getMessage());
            return ResponseEntity.ok(new AiResponse(reply, "chat"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/describe/{propertyId}")
    public ResponseEntity<?> describe(@PathVariable String propertyId,
                                      HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        if (role == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Authentication required."));
        }
        try {
            String description = aiService.describePropertyById(propertyId);
            return ResponseEntity.ok(new AiResponse(description, "description"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
