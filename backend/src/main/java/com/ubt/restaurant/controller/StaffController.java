package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Staff;
import com.ubt.restaurant.repository.StaffRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffRepository repo;

    public StaffController(StaffRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Staff> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Staff create(@RequestBody Staff s) {
        s.setId(null);
        return repo.save(s);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> update(@PathVariable Long id, @RequestBody Staff s) {
        return repo.findById(id).map(existing -> {
            existing.setFirstName(s.getFirstName());
            existing.setLastName(s.getLastName());
            existing.setPosition(s.getPosition());
            existing.setPhone(s.getPhone());
            existing.setShift(s.getShift());
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
