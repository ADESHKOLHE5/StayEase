package com.property.property_service.service;

import com.property.property_service.entity.Property;
import com.property.property_service.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repository;

    public Property saveProperty(Property property, Long ownerId, String ownerName) {
        // set owner info forwarded by API Gateway
        if (ownerId != null) property.setOwnerId(ownerId);
        if (ownerName != null) property.setOwnerName(ownerName);

        // initialize availability if not set
        if (property.getAvailableRooms() == null) {
            property.setAvailableRooms(property.getTotalRooms());
        }

        return repository.save(property);
    }

    public List<Property> findAll() {
        return repository.findAll();
    }

    public List<Property> findByOwnerId(Long ownerId) {
        return repository.findByOwnerId(ownerId);
    }

    public Property findById(String propertyId) {
        return repository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));
    }

    public List<Property> findByCity(String city) {
        return repository.findByCity(city);
    }

    public Property updateProperty(String propertyId, Property propertyDetails, Long ownerId) {
        Property property = repository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));

        // Verify owner
        if (!property.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to update this property");
        }

        // Update allowed fields
        if (propertyDetails.getPropertyName() != null) {
            property.setPropertyName(propertyDetails.getPropertyName());
        }
        if (propertyDetails.getAddress() != null) {
            property.setAddress(propertyDetails.getAddress());
        }
        if (propertyDetails.getCity() != null) {
            property.setCity(propertyDetails.getCity());
        }
        if (propertyDetails.getPropertyType() != null) {
            property.setPropertyType(propertyDetails.getPropertyType());
        }
        if (propertyDetails.getRentPerMonth() != null) {
            property.setRentPerMonth(propertyDetails.getRentPerMonth());
        }
        if (propertyDetails.getFacilities() != null) {
            property.setFacilities(propertyDetails.getFacilities());
        }
        if (propertyDetails.getTotalRooms() != null) {
            property.setTotalRooms(propertyDetails.getTotalRooms());
        }

        return repository.save(property);
    }

    public void deleteProperty(String propertyId, Long ownerId) {
        Property property = repository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));

        // Verify owner
        if (!property.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to delete this property");
        }

        repository.deleteById(propertyId);
    }

    public void updateAvailability(String propertyId, int change) {
        Property property = repository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));

        int newCount = property.getAvailableRooms() + change;

        if (newCount < 0) {
            throw new RuntimeException("No rooms available for this property!");
        }

        property.setAvailableRooms(newCount);
        repository.save(property);
    }
}
