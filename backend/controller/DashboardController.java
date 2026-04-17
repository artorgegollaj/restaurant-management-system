package com.ubt.restaurant.controller;

import com.ubt.restaurant.repository.OrderItemRepository;
import com.ubt.restaurant.repository.OrderRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;

    public DashboardController(OrderRepository orderRepo, OrderItemRepository orderItemRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = today.withDayOfMonth(today.lengthOfMonth()).atTime(LocalTime.MAX);

        BigDecimal dailySales = orderRepo.sumSalesBetween(startOfDay, endOfDay);
        BigDecimal monthlySales = orderRepo.sumSalesBetween(startOfMonth, endOfMonth);
        long totalOrders = orderRepo.count();

        List<Object[]> top = orderItemRepo.topSellingItems(PageRequest.of(0, 5));
        List<Map<String, Object>> topItems = new ArrayList<>();
        for (Object[] row : top) {
            Map<String, Object> m = new HashMap<>();
            m.put("name", row[0]);
            m.put("quantity", row[1]);
            topItems.add(m);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("dailySales", dailySales);
        res.put("monthlySales", monthlySales);
        res.put("totalOrders", totalOrders);
        res.put("topItems", topItems);
        return res;
    }

    @GetMapping("/sales-report")
    public Map<String, Object> salesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);
        BigDecimal total = orderRepo.sumSalesBetween(start, end);
        var orders = orderRepo.findByOrderDateBetween(start, end);

        Map<String, Object> res = new HashMap<>();
        res.put("from", from);
        res.put("to", to);
        res.put("total", total);
        res.put("orders", orders);
        return res;
    }
}
