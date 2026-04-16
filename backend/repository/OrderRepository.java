package com.ubt.restaurant.repository;

import com.ubt.restaurant.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    @Query("select coalesce(sum(o.total), 0) from OrderEntity o where o.orderDate between :start and :end and o.status = 'PAID'")
    BigDecimal sumSalesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    List<OrderEntity> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}
