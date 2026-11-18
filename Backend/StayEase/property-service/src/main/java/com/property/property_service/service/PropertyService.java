package com.property.property_service.service;

import com.property.property_service.config.PropertyLimitConfig;
import com.property.property_service.dto.OwnerMyPropertyDto;
import com.property.property_service.dto.PropertyCardShowDto;
import com.property.property_service.dto.PropertyInternalDTO;

import com.property.property_service.dto.UpdatePropertyRequest;
import com.property.property_service.entity.Property;
import com.property.property_service.exception.PropertyNotFoundExceptions;
import com.property.property_service.exception.ResourceNotFoundException;
import com.property.property_service.exception.UnauthorizedAccessException;
import com.property.property_service.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

        LocalDateTime now = LocalDateTime.now();

        if (property.getCreatedAt() == null) {
            property.setCreatedAt(now);  // first save only
        }
        property.setUpdatedAt(now);      // every save

        return propertyRepository.save(property);
    }

    public List<Property> findAll() {
        return propertyRepository.findAll();
    }

//    public List<Property> findByOwnerId(Long ownerId) {
//
//        return propertyRepository.findByOwnerId(ownerId);
//    }

    public List<OwnerMyPropertyDto> findByOwnerId(Long ownerId) {

        List<Property> properties = propertyRepository.findByOwnerId(ownerId);


        return properties.stream()
                .map(p -> new OwnerMyPropertyDto(
                        p.getPropertyId(),
                        p.getPropertyName(),
                        p.getImageUrl(),
                        p.getCity(),
                        p.getAddress(),
                        p.getRentPerMonth(),
                        p.getAvailableRooms(),
                        p.getTotalRooms()

                ))
                .toList();
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



    public Property updateProperty(String propertyId,
                                   UpdatePropertyRequest request,
                                   Long ownerId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new PropertyNotFoundExceptions("Property not found with ID: " + propertyId));


        if (!property.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedAccessException("You don't have permission to update this property");
        }

        // basic info
        if (request.getPropertyName() != null)    property.setPropertyName(request.getPropertyName());
        if (request.getPropertyType() != null)    property.setPropertyType(request.getPropertyType());
        if (request.getAddress()      != null)    property.setAddress(request.getAddress());
        if (request.getCity()         != null)    property.setCity(request.getCity());
        if (request.getState()        != null)    property.setState(request.getState());
        if (request.getPincode()      != null)    property.setPincode(request.getPincode());

        //  unit & pricing
        if (request.getTotalRooms()      != null) property.setTotalRooms(request.getTotalRooms());
        if (request.getAvailableRooms()  != null) property.setAvailableRooms(request.getAvailableRooms());
        if (request.getRentPerMonth()    != null) property.setRentPerMonth(request.getRentPerMonth());
        if (request.getSecurityDeposit() != null) property.setSecurityDeposit(request.getSecurityDeposit());
        if (request.getRentIncludes()    != null) property.setRentIncludes(request.getRentIncludes());

        // amenities & timings
        if (request.getFacilities()   != null) property.setFacilities(request.getFacilities());
        if (request.getCheckInTime()  != null) property.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null) property.setCheckOutTime(request.getCheckOutTime());
        if (request.getDescription()  != null) property.setDescription(request.getDescription());
        if (request.getImageUrl()     != null) property.setImageUrl(request.getImageUrl());

        //  policies
        if (request.getCancellationPolicy() != null) property.setCancellationPolicy(request.getCancellationPolicy());
        if (request.getDepositPolicy()      != null) property.setDepositPolicy(request.getDepositPolicy());
        if (request.getHouseRules()         != null) property.setHouseRules(request.getHouseRules());

        //  always update timestamp
        property.setUpdatedAt(LocalDateTime.now());

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
        PropertyInternalDTO dto = new PropertyInternalDTO();
        dto.setPropertyId(p.getPropertyId());
        dto.setOwnerId(p.getOwnerId());
        dto.setOwnerName(p.getOwnerName());
        dto.setPropertyName(p.getPropertyName());
        dto.setPropertyType(p.getPropertyType());
        dto.setAvailableRooms(p.getAvailableRooms());
        dto.setTotalRooms(p.getTotalRooms());
        dto.setRentPerMonth(p.getRentPerMonth());
        dto.setRequestLimit(limit);
        dto.setImageUrl(p.getImageUrl());
        dto.setAddress(p.getAddress());
        dto.setCity(p.getCity());
        dto.setState(p.getState());
        dto.setCheckInTime(p.getCheckInTime());
        dto.setCheckOutTime(p.getCheckOutTime());
        return dto;
    }

    public List<PropertyCardShowDto> getAllProperties() {

        List<Property> properties = propertyRepository.findAll();

        return properties.stream().map(property -> PropertyCardShowDto.builder()
                .propertyId(property.getPropertyId())
                .propertyName(property.getPropertyName())
                .propertyType(property.getPropertyType())
                .city(property.getCity())
                .state(property.getState())
                .address(property.getAddress())
                .ownerId(property.getOwnerId())
                .ownerName(property.getOwnerName())
                .rentPerMonth(property.getRentPerMonth())
                .availableRooms(property.getAvailableRooms())
                .totalRooms(property.getTotalRooms())
                .facilities(property.getFacilities())
                .description(property.getDescription())
                .imageUrl(property.getImageUrl())
                .checkInTime(property.getCheckInTime())
                .checkOutTime(property.getCheckOutTime())
                .build()
        ).collect(Collectors.toList());
    }

}
