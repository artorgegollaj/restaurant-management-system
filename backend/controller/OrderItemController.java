package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.OrderItem;
import com.ubt.restaurant.repository.MenuItemRepository;
import com.ubt.restaurant.repository.OrderItemRepository;
import com.ubt.restaurant.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemRepository repo;
    private final OrderRepository orderRepo;
    private final MenuItemRepository menuItemRepo;

    public OrderItemController(OrderItemRepository repo, OrderRepository orderRepo, MenuItemRepository menuItemRepo) {
        this.repo = repo;
        this.orderRepo = orderRepo;
        this.menuItemRepo = menuItemRepo;
    }

    @GetMapping
    public List<OrderItem> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderItem create(@RequestBody OrderItem i) {
        i.setId(null);
        if (i.getOrder() != null && i.getOrder().getId() != null) {
            i.setOrder(orderRepo.findById(i.getOrder().getId()).orElse(null));
        }
        if (i.getMenuItem() != null && i.getMenuItem().getId() != null) {
            i.setMenuItem(menuItemRepo.findById(i.getMenuItem().getId()).orElse(null));
        }
        return repo.save(i);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> update(@PathVariable Long id, @RequestBody OrderItem i) {
        return repo.findById(id).map(existing -> {
            existing.setQuantity(i.getQuantity());
            existing.setPrice(i.getPrice());
            existing.setNotes(i.getNotes());
            if (i.getOrder() != null && i.getOrder().getId() != null) {
                existing.setOrder(orderRepo.findById(i.getOrder().getId()).orElse(null));
            }
            if (i.getMenuItem() != null && i.getMenuItem().getId() != null) {
                existing.setMenuItem(menuItemRepo.findById(i.getMenuItem().getId()).orElse(null));
            }
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
