package com.property.property_service.service;

import com.property.property_service.entity.Property;
import com.property.property_service.exception.PropertyNotFoundExceptions;
import com.property.property_service.exception.UnauthorizedAccessException;
import com.property.property_service.repository.PropertyRepository;
import jakarta.el.PropertyNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepo;

    public Property saveProperty(Property property, Long ownerId, String ownerName) {
        // set owner info forwarded by API Gateway
        if (ownerId != null) property.setOwnerId(ownerId);
        if (ownerName != null) property.setOwnerName(ownerName);

        // initialize availability if not set
        if (property.getAvailableRooms() == null) {
            property.setAvailableRooms(property.getTotalRooms());
        }

        return propertyRepo.save(property);
    }

    public List<Property> findAll() {
        return propertyRepo.findAll();
    }

    public List<Property> findByOwnerId(Long ownerId) {

        return propertyRepo.findByOwnerId(ownerId);
    }

    public Property findById(String propertyId) {
        return propertyRepo.findById(propertyId)
                .orElseThrow(() ->  new PropertyNotFoundExceptions("Property not found with ID: " + propertyId));
    }

    public List<Property> searchWithFilters(
            String city,
            String propertyType,
            Double maxRent) {

        List<Property> allProperties = propertyRepo.findAll();
        List<Property> filteredList = new ArrayList<>();

        for (Property p : allProperties) {

            // city filter
            if (city != null && !city.isEmpty()
                    && !p.getCity().equalsIgnoreCase(city)) {
                continue;
            }

            // property filter
            if (propertyType != null && !propertyType.isEmpty()
                    && !p.getPropertyType().equalsIgnoreCase(propertyType)) {
                continue;
            }

//            // furnished filter
//            if (furnished != null) {
//                if (!furnished.equals(p.getFurnished())) {
//                    continue;
//                }
//            }

            //  Rent filter
            if (maxRent != null) {
                if (p.getRentPerMonth() == null ||
                        p.getRentPerMonth() > maxRent) {
                    continue;
                }
            }

            filteredList.add(p);
        }

        return filteredList;
    }

    public Property updateProperty(String propertyId, Property propertyDetails, Long ownerId) {
        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundExceptions("Property not found with ID: " + propertyId));

        // verify owner
        if (!property.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedAccessException("You don't have permission to update this property");
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

        return propertyRepo.save(property);
    }

    public void deleteProperty(String propertyId, Long ownerId) {
        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));

        // Verify owner
        if (!property.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to delete this property");
        }

        propertyRepo.deleteById(propertyId);
    }

    public void updateAvailability(String propertyId, int change) {
        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));

        int newCount = property.getAvailableRooms() + change;

        if (newCount < 0) {
            throw new RuntimeException("No rooms available for this property!");
        }

        property.setAvailableRooms(newCount);
        propertyRepo.save(property);
    }
}
