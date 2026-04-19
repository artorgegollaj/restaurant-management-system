package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.MenuItem;
import com.ubt.restaurant.repository.MenuCategoryRepository;
import com.ubt.restaurant.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    private final MenuItemRepository repo;
    private final MenuCategoryRepository categoryRepo;

    public MenuItemController(MenuItemRepository repo, MenuCategoryRepository categoryRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public List<MenuItem> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MenuItem create(@RequestBody MenuItem m) {
        m.setId(null);
        if (m.getCategory() != null && m.getCategory().getId() != null) {
            m.setCategory(categoryRepo.findById(m.getCategory().getId()).orElse(null));
        }
        return repo.save(m);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> update(@PathVariable Long id, @RequestBody MenuItem m) {
        return repo.findById(id).map(existing -> {
            existing.setName(m.getName());
            existing.setDescription(m.getDescription());
            existing.setPrice(m.getPrice());
            existing.setImage(m.getImage());
            existing.setAvailable(m.isAvailable());
            if (m.getCategory() != null && m.getCategory().getId() != null) {
                existing.setCategory(categoryRepo.findById(m.getCategory().getId()).orElse(null));
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
