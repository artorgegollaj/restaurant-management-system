package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Role;
import com.ubt.restaurant.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleRepository repo;

    public RoleController(RoleRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Role> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Role create(@RequestBody Role r) {
        r.setId(null);
        return repo.save(r);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> update(@PathVariable Long id, @RequestBody Role r) {
        return repo.findById(id).map(existing -> {
            existing.setName(r.getName());
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
