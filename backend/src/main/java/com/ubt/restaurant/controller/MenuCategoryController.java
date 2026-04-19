package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.MenuCategory;
import com.ubt.restaurant.repository.MenuCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-categories")
public class MenuCategoryController {

    private final MenuCategoryRepository repo;

    public MenuCategoryController(MenuCategoryRepository repo) { this.repo = repo; }

    @GetMapping
    public List<MenuCategory> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<MenuCategory> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MenuCategory create(@RequestBody MenuCategory c) {
        c.setId(null);
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuCategory> update(@PathVariable Long id, @RequestBody MenuCategory c) {
        return repo.findById(id).map(existing -> {
            existing.setName(c.getName());
            existing.setDescription(c.getDescription());
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
