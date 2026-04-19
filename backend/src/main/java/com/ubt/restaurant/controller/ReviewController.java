package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Review;
import com.ubt.restaurant.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository repo;

    public ReviewController(ReviewRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Review> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Review create(@RequestBody Review r) {
        r.setId(null);
        return repo.save(r);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long id, @RequestBody Review r) {
        return repo.findById(id).map(existing -> {
            existing.setCustomerName(r.getCustomerName());
            existing.setRating(r.getRating());
            existing.setComment(r.getComment());
            existing.setReviewDate(r.getReviewDate());
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
