package com.ubt.restaurant.repository;

import com.ubt.restaurant.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("select oi.menuItem.name as name, sum(oi.quantity) as qty " +
           "from OrderItem oi group by oi.menuItem.name order by sum(oi.quantity) desc")
    List<Object[]> topSellingItems(Pageable pageable);
}
