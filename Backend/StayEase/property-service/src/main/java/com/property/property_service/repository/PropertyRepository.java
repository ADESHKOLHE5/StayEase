package com.property.property_service.repository;



import com.property.property_service.entity.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {
    List<Property> findByCity(String city);
    List<Property> findByCityIgnoreCase(String city);
    List<Property> findByOwnerId(Long ownerId);
}