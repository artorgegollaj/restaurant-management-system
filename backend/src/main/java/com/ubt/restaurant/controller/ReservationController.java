package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Reservation;
import com.ubt.restaurant.repository.ReservationRepository;
import com.ubt.restaurant.repository.RestaurantTableRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository repo;
    private final RestaurantTableRepository tableRepo;

    public ReservationController(ReservationRepository repo, RestaurantTableRepository tableRepo) {
        this.repo = repo;
        this.tableRepo = tableRepo;
    }

    @GetMapping
    public List<Reservation> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reservation create(@Valid @RequestBody Reservation r) {
        r.setId(null);
        if (r.getTable() != null && r.getTable().getId() != null) {
            r.setTable(tableRepo.findById(r.getTable().getId()).orElse(null));
        }
        checkTableAvailable(r, null);
        return repo.save(r);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(@PathVariable Long id, @Valid @RequestBody Reservation r) {
        return repo.findById(id).map(existing -> {
            existing.setCustomerName(r.getCustomerName());
            existing.setPhone(r.getPhone());
            existing.setReservationDate(r.getReservationDate());
            existing.setReservationTime(r.getReservationTime());
            existing.setPartySize(r.getPartySize());
            existing.setStatus(r.getStatus());
            if (r.getTable() != null && r.getTable().getId() != null) {
                existing.setTable(tableRepo.findById(r.getTable().getId()).orElse(null));
            }
            checkTableAvailable(existing, existing.getId());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Rejects a reservation that double-books a table at the same date and time.
    // Cancelled reservations don't count. excludeId skips the row being updated.
    private void checkTableAvailable(Reservation r, Long excludeId) {
        if (r.getTable() == null || r.getTable().getId() == null
                || r.getReservationDate() == null || r.getReservationTime() == null) {
            return;
        }
        boolean taken = repo.findByTable_IdAndReservationDateAndStatusNot(
                r.getTable().getId(), r.getReservationDate(), "CANCELLED").stream()
            .filter(existing -> excludeId == null || !existing.getId().equals(excludeId))
            .anyMatch(existing -> r.getReservationTime().equals(existing.getReservationTime()));
        if (taken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Tavolina eshte e zene per kete date dhe ore");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
