package com.ubt.restaurant.controller;

import com.ubt.restaurant.repository.OrderRepository;
import com.ubt.restaurant.repository.OrderItemRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class DashboardController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;

    public DashboardController(OrderRepository orderRepo, OrderItemRepository itemRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
    }

    public record DailySale(LocalDate date, long count, BigDecimal total) {}
    public record TopProduct(String name, long quantity, BigDecimal revenue) {}
    public record DashboardSummary(
        long totalOrders, BigDecimal totalRevenue, long pendingOrders,
        long todayOrders, BigDecimal todayRevenue) {}

    @GetMapping("/daily-sales")
    public List<DailySale> dailySales(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        if (from == null) from = LocalDate.now().minusDays(7);
        if (to == null) to = LocalDate.now();

        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.plusDays(1).atStartOfDay();

        var orders = orderRepo.findAll().stream()
            .filter(o -> "PAID".equals(o.getStatus()))
            .filter(o -> !o.getOrderDate().isBefore(fromDt) && o.getOrderDate().isBefore(toDt))
            .toList();

        Map<LocalDate, List<com.ubt.restaurant.entity.OrderEntity>> grouped = new TreeMap<>();
        for (var o : orders) {
            grouped.computeIfAbsent(o.getOrderDate().toLocalDate(), k -> new ArrayList<>()).add(o);
        }

        List<DailySale> result = new ArrayList<>();
        LocalDate cursor = from;
        while (!cursor.isAfter(to)) {
            var list = grouped.getOrDefault(cursor, List.of());
            BigDecimal total = list.stream().map(o -> o.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            result.add(new DailySale(cursor, list.size(), total));
            cursor = cursor.plusDays(1);
        }
        return result;
    }

    @GetMapping("/top-products")
    public List<TopProduct> topProducts(@RequestParam(defaultValue = "5") int limit) {
        Map<String, long[]> agg = new HashMap<>();   // [qty, revenueScaled]
        for (var oi : itemRepo.findAll()) {
            String name = oi.getMenuItem().getName();
            long[] cur = agg.getOrDefault(name, new long[]{0L, 0L});
            cur[0] += oi.getQuantity();
            cur[1] += oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity()))
                        .multiply(BigDecimal.valueOf(100)).longValue();
            agg.put(name, cur);
        }
        return agg.entrySet().stream()
            .sorted((a, b) -> Long.compare(b.getValue()[0], a.getValue()[0]))
            .limit(limit)
            .map(e -> new TopProduct(e.getKey(), e.getValue()[0],
                BigDecimal.valueOf(e.getValue()[1]).divide(BigDecimal.valueOf(100))))
            .toList();
    }

    @GetMapping("/summary")
    public DashboardSummary summary() {
        var all = orderRepo.findAll();
        BigDecimal total = all.stream().filter(o -> "PAID".equals(o.getStatus()))
            .map(o -> o.getTotal()).reduce(BigDecimal.ZERO, BigDecimal::add);
        long pending = all.stream().filter(o -> "PENDING".equals(o.getStatus()) || "IN_PROGRESS".equals(o.getStatus())).count();
        var today = LocalDate.now();
        var todayOrders = all.stream()
            .filter(o -> o.getOrderDate().toLocalDate().equals(today))
            .filter(o -> "PAID".equals(o.getStatus()))
            .toList();
        BigDecimal todayRevenue = todayOrders.stream()
            .map(o -> o.getTotal()).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new DashboardSummary(all.size(), total, pending, todayOrders.size(), todayRevenue);
    }
}

