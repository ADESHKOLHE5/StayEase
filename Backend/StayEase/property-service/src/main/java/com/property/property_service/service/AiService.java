package com.property.property_service.service;


import com.property.property_service.dto.SummarizeRequest;
import com.property.property_service.entity.Property;
import com.property.property_service.repository.PropertyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AiService {

    private final ChatClient chatClient;
    private final PropertyRepository propertyRepository;

    public AiService(ChatClient.Builder builder, PropertyRepository propertyRepository) {
        this.chatClient = builder.build();
        this.propertyRepository = propertyRepository;
    }

    //  summarize a property card
    public String summarizeProperty(SummarizeRequest req) {
        String prompt = """
                You are a real estate assistant for StayEase, an Indian rental platform.
                Write a concise, friendly 2-3 sentence summary of the property below.
                Highlight key benefits for a potential tenant.
                Respond in plain text only — no markdown, no bullet points.

                Property Name   : %s
                Type            : %s
                City            : %s, %s
                Address         : %s
                Rent/Month      : ₹%.0f
                Security Deposit: ₹%.0f
                Available Rooms : %d
                Facilities      : %s
                Check-in Time   : %s
                Check-out Time  : %s
                Description     : %s
                """.formatted(
                req.getPropertyName(),
                req.getPropertyType(),
                req.getCity(),
                req.getState() != null ? req.getState() : "",
                req.getAddress(),
                req.getRentPerMonth()    != null ? req.getRentPerMonth()    : 0,
                req.getSecurityDeposit() != null ? req.getSecurityDeposit() : 0,
                req.getAvailableRooms()  != null ? req.getAvailableRooms()  : 0,
                req.getFacilities()      != null ? String.join(", ", req.getFacilities()) : "None listed",
                req.getCheckInTime()     != null ? req.getCheckInTime()     : "N/A",
                req.getCheckOutTime()    != null ? req.getCheckOutTime()    : "N/A",
                req.getDescription()     != null ? req.getDescription()     : "N/A"
        );

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    //  recommend properties from MongoDB
    public String getRecommendations(String city, String propertyType, Double maxRent) {

        List<Property> filtered = propertyRepository.findAll().stream()
                .filter(p -> city         == null || city.equalsIgnoreCase(p.getCity()))
                .filter(p -> propertyType == null || propertyType.equalsIgnoreCase(p.getPropertyType()))
                .filter(p -> maxRent      == null || (p.getRentPerMonth() != null && p.getRentPerMonth() <= maxRent))
                .filter(p -> p.getAvailableRooms() != null && p.getAvailableRooms() > 0)
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            return "No properties found matching your criteria. Try broadening your search filters.";
        }

        String propertyList = filtered.stream()
                .map(p -> "- %s (%s) in %s, %s — ₹%.0f/mo | %d rooms available | Facilities: %s".formatted(
                        p.getPropertyName(),
                        p.getPropertyType(),
                        p.getCity(),
                        p.getState()         != null ? p.getState()         : "",
                        p.getRentPerMonth()   != null ? p.getRentPerMonth()   : 0.0,
                        p.getAvailableRooms() != null ? p.getAvailableRooms() : 0,
                        p.getFacilities()     != null ? String.join(", ", p.getFacilities()) : "N/A"
                ))
                .collect(Collectors.joining("\n"));

        String prompt = """
                You are a helpful real estate assistant for Indian tenants on StayEase.
                Given the available properties below, recommend the top 3 and briefly explain
                why each is a good fit. Keep the tone friendly and under 150 words total.

                Available properties:
                %s
                """.formatted(propertyList);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    //  general chatbot
    public String chatWithUser(String userMessage) {
        return chatClient.prompt()
                .system("""
                        You are a helpful assistant for StayEase, a property rental platform in India.
                        Answer tenant and landlord questions about renting PGs, hostels, apartments,
                        lease agreements, security deposits, check-in/check-out, and platform features.
                        Be concise and friendly. If a question is unrelated to real estate, politely redirect.
                        """)
                .user(userMessage)
                .call()
                .content();
    }

    // ── Feature 4: Describe property by ID ───────────────────────────────────
    public String describePropertyById(String propertyId) {
        Property p = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found: " + propertyId));

        String prompt = """
                You are a real estate assistant. Write a detailed, engaging description
                of this property for potential tenants. Include all relevant details.
                Respond in plain text — no markdown.

                Property Name   : %s
                Type            : %s
                City            : %s, %s
                Address         : %s
                Rent/Month      : ₹%.0f
                Security Deposit: ₹%.0f
                Total Rooms     : %d | Available: %d
                Facilities      : %s
                Check-in Time   : %s
                Check-out Time  : %s
                House Rules     : %s
                Cancellation    : %s
                Deposit Policy  : %s
                Description     : %s
                """.formatted(
                p.getPropertyName(),
                p.getPropertyType(),
                p.getCity(),
                p.getState()             != null ? p.getState()             : "",
                p.getAddress(),
                p.getRentPerMonth()      != null ? p.getRentPerMonth()      : 0,
                p.getSecurityDeposit()   != null ? p.getSecurityDeposit()   : 0,
                p.getTotalRooms()        != null ? p.getTotalRooms()        : 0,
                p.getAvailableRooms()    != null ? p.getAvailableRooms()    : 0,
                p.getFacilities()        != null ? String.join(", ", p.getFacilities()) : "None listed",
                p.getCheckInTime()       != null ? p.getCheckInTime()       : "N/A",
                p.getCheckOutTime()      != null ? p.getCheckOutTime()      : "N/A",
                p.getHouseRules()        != null ? p.getHouseRules()        : "N/A",
                p.getCancellationPolicy() != null ? p.getCancellationPolicy() : "N/A",
                p.getDepositPolicy()     != null ? p.getDepositPolicy()     : "N/A",
                p.getDescription()       != null ? p.getDescription()       : "N/A"
        );

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
