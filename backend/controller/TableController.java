package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.RestaurantTable;
import com.ubt.restaurant.repository.RestaurantTableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final RestaurantTableRepository repo;

    public TableController(RestaurantTableRepository repo) { this.repo = repo; }

    @GetMapping
    public List<RestaurantTable> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RestaurantTable create(@RequestBody RestaurantTable t) {
        t.setId(null);
        return repo.save(t);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> update(@PathVariable Long id, @RequestBody RestaurantTable t) {
        return repo.findById(id).map(existing -> {
            existing.setTableNumber(t.getTableNumber());
            existing.setCapacity(t.getCapacity());
            existing.setStatus(t.getStatus());
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
