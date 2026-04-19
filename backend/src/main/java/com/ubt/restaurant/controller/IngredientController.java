package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Ingredient;
import com.ubt.restaurant.repository.IngredientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientRepository repo;

    public IngredientController(IngredientRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Ingredient> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ingredient create(@RequestBody Ingredient i) {
        i.setId(null);
        return repo.save(i);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> update(@PathVariable Long id, @RequestBody Ingredient i) {
        return repo.findById(id).map(existing -> {
            existing.setName(i.getName());
            existing.setUnit(i.getUnit());
            existing.setQuantityAvailable(i.getQuantityAvailable());
            existing.setMinimumQuantity(i.getMinimumQuantity());
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
