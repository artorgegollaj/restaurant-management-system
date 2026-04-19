package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.OrderEntity;
import com.ubt.restaurant.repository.OrderRepository;
import com.ubt.restaurant.repository.RestaurantTableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository repo;
    private final RestaurantTableRepository tableRepo;

    public OrderController(OrderRepository repo, RestaurantTableRepository tableRepo) {
        this.repo = repo;
        this.tableRepo = tableRepo;
    }

    @GetMapping
    public List<OrderEntity> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<OrderEntity> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderEntity create(@RequestBody OrderEntity o) {
        o.setId(null);
        if (o.getTable() != null && o.getTable().getId() != null) {
            o.setTable(tableRepo.findById(o.getTable().getId()).orElse(null));
        }
        return repo.save(o);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderEntity> update(@PathVariable Long id, @RequestBody OrderEntity o) {
        return repo.findById(id).map(existing -> {
            existing.setStatus(o.getStatus());
            existing.setTotal(o.getTotal());
            existing.setOrderType(o.getOrderType());
            if (o.getTable() != null && o.getTable().getId() != null) {
                existing.setTable(tableRepo.findById(o.getTable().getId()).orElse(null));
            }
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderEntity> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repo.findById(id).map(existing -> {
            existing.setStatus(body.get("status"));
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
