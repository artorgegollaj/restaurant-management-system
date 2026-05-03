package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.MenuItem;
import com.ubt.restaurant.entity.OrderEntity;
import com.ubt.restaurant.entity.OrderItem;
import com.ubt.restaurant.repository.MenuItemRepository;
import com.ubt.restaurant.repository.OrderItemRepository;
import com.ubt.restaurant.repository.OrderRepository;
import com.ubt.restaurant.repository.RestaurantTableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Set<String> VALID_STATUSES = Set.of(
        "PENDING", "IN_PROGRESS", "DELIVERED", "PAID", "CANCELLED"
    );

    private static final Map<String, Set<String>> ALLOWED_TRANSITIONS = Map.of(
        "PENDING",     Set.of("IN_PROGRESS", "CANCELLED"),
        "IN_PROGRESS", Set.of("DELIVERED", "CANCELLED"),
        "DELIVERED",   Set.of("PAID", "CANCELLED"),
        "PAID",        Set.of(),       // perfundimtar
        "CANCELLED",   Set.of()        // perfundimtar
    );

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;
    private final MenuItemRepository menuRepo;
    private final RestaurantTableRepository tableRepo;

    public OrderController(OrderRepository orderRepo, OrderItemRepository itemRepo,
                           MenuItemRepository menuRepo, RestaurantTableRepository tableRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.menuRepo = menuRepo;
        this.tableRepo = tableRepo;
    }

    public record OrderItemRequest(Long menuItemId, Integer quantity, String notes) {}
    public record OrderRequest(Long tableId, String orderType, String status, List<OrderItemRequest> items) {}

    @GetMapping
    public List<OrderEntity> getAll() { return orderRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<OrderEntity> getOne(@PathVariable Long id) {
        return orderRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAITER')")
    @PostMapping
    public OrderEntity create(@RequestBody OrderRequest req) {
        if (req.items() == null || req.items().isEmpty()) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,
                "Porosia duhet te kete te pakten nje artikull");
        }

        OrderEntity o = new OrderEntity();
        o.setOrderType(req.orderType() == null ? "DINE_IN" : req.orderType());
        o.setStatus(req.status() == null ? "PENDING" : req.status());
        if (req.tableId() != null) {
            o.setTable(tableRepo.findById(req.tableId())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Tavolina nuk u gjet")));
        }
        OrderEntity saved = orderRepo.save(o);

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest it : req.items()) {
            MenuItem mi = menuRepo.findById(it.menuItemId())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,
                    "Artikulli i menyse nuk u gjet: " + it.menuItemId()));
            OrderItem oi = new OrderItem();
            oi.setOrder(saved);
            oi.setMenuItem(mi);
            oi.setQuantity(it.quantity());
            oi.setPrice(mi.getPrice());
            oi.setNotes(it.notes());
            itemRepo.save(oi);
            total = total.add(mi.getPrice().multiply(BigDecimal.valueOf(it.quantity())));
        }
        saved.setTotal(total);
        return orderRepo.save(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderEntity> update(@PathVariable Long id, @RequestBody OrderRequest req) {
        return orderRepo.findById(id).map(existing -> {
            if (req.orderType() != null) existing.setOrderType(req.orderType());
            if (req.status() != null) existing.setStatus(req.status());
            if (req.tableId() != null) {
                existing.setTable(tableRepo.findById(req.tableId()).orElse(null));
            }
            return ResponseEntity.ok(orderRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAITER')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderEntity> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null || !VALID_STATUSES.contains(newStatus)) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,
                "Status i pavlefshem. Vlerat e pranueshme: " + VALID_STATUSES);
        }
        return orderRepo.findById(id).map(existing -> {
            Set<String> allowed = ALLOWED_TRANSITIONS.getOrDefault(existing.getStatus(), Set.of());
            if (!allowed.contains(newStatus)) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,
                    "Tranzicion i pavlefshem nga " + existing.getStatus() + " ne " + newStatus);
            }
            existing.setStatus(newStatus);
            return ResponseEntity.ok(orderRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!orderRepo.existsById(id)) return ResponseEntity.notFound().build();
        itemRepo.deleteAll(itemRepo.findByOrderId(id));
        orderRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
