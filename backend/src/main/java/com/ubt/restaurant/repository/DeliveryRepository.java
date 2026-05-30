package com.ubt.restaurant.repository;

import com.ubt.restaurant.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    long countByStatus(String status);

    long countByStatusAndCreatedAtBetween(String status, LocalDateTime from, LocalDateTime to);
}
