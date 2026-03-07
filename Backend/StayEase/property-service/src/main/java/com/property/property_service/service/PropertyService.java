package com.property.property_service.service;

import com.property.property_service.config.PropertyLimitConfig;
import com.property.property_service.dto.PropertyInternalDTO;
import com.property.property_service.entity.Property;
import com.property.property_service.exception.PropertyNotFoundExceptions;
import com.property.property_service.exception.ResourceNotFoundException;
import com.property.property_service.exception.UnauthorizedAccessException;
import com.property.property_service.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyLimitConfig limitConfig;


    public Property saveProperty(Property property, Long ownerId, String ownerName) {
        property.setOwnerId(ownerId);
        property.setOwnerName(ownerName);
        if (property.getAvailableRooms() == null) {
            property.setAvailableRooms(property.getTotalRooms());
        }
        return propertyRepository.save(property);
    }

    public List<Property> findAll() {
        return propertyRepository.findAll();
    }

    public List<Property> findByOwnerId(Long ownerId) {

        return propertyRepository.findByOwnerId(ownerId);
    }

    public Property findById(String id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id));
    }

    public List<Property> searchWithFilters(String city, String propertyType, Double maxRent) {
        return propertyRepository.findAll().stream()
                .filter(p -> city == null || p.getCity().equalsIgnoreCase(city))
                .filter(p -> propertyType == null || p.getPropertyType().equalsIgnoreCase(propertyType))
                .filter(p -> maxRent == null || p.getRentPerMonth() <= maxRent)
                .collect(Collectors.toList());
    }



    public Property updateProperty(String propertyId, Property propertyDetails, Long ownerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundExceptions("Property not found with ID: " + propertyId));

        // verify owner
        if (!property.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedAccessException("You don't have permission to update this property");
        }

        // Update allowed fields

        property.setPropertyName(propertyDetails.getPropertyName());

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

        return propertyRepository.save(property);
    }

    public void deleteProperty(String id, Long ownerId) {
        Property existing = findById(id);
        if (!existing.getOwnerId().equals(ownerId))
            throw new UnauthorizedAccessException("You can only delete your own properties");
        propertyRepository.deleteById(id);
    }

    public void updateAvailability(String propertyId, int change) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundExceptions("Property not found with ID: " + propertyId));

        int newCount = property.getAvailableRooms() + change;

        if (newCount < 0) {
            throw new RuntimeException("No rooms available for this property!");
        }

        property.setAvailableRooms(newCount);
        propertyRepository.save(property);
    }

    public PropertyInternalDTO getPropertyInternal(String id) {
        Property p = findById(id);
        int limit = limitConfig.getLimitForType(p.getPropertyType());
        return new PropertyInternalDTO(
                p.getPropertyId(),
                p.getOwnerId(),
                p.getOwnerName(),
                p.getPropertyName(),
                p.getPropertyType(),
                p.getAvailableRooms(),
                p.getTotalRooms(),
                p.getRentPerMonth(),
                limit
        );

    }
}
