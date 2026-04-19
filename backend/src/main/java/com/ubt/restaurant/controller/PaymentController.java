package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Payment;
import com.ubt.restaurant.repository.OrderRepository;
import com.ubt.restaurant.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository repo;
    private final OrderRepository orderRepo;

    public PaymentController(PaymentRepository repo, OrderRepository orderRepo) {
        this.repo = repo;
        this.orderRepo = orderRepo;
    }

    @GetMapping
    public List<Payment> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Payment create(@RequestBody Payment p) {
        p.setId(null);
        if (p.getOrder() != null && p.getOrder().getId() != null) {
            p.setOrder(orderRepo.findById(p.getOrder().getId()).orElse(null));
        }
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(@PathVariable Long id, @RequestBody Payment p) {
        return repo.findById(id).map(existing -> {
            existing.setAmount(p.getAmount());
            existing.setMethod(p.getMethod());
            existing.setPaymentDate(p.getPaymentDate());
            if (p.getOrder() != null && p.getOrder().getId() != null) {
                existing.setOrder(orderRepo.findById(p.getOrder().getId()).orElse(null));
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
