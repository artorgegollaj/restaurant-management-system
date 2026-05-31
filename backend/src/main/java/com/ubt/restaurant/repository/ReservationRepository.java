package com.ubt.restaurant.repository;

import com.ubt.restaurant.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Active (non-cancelled) reservations for a table on a given date.
    // Time is compared in Java to avoid MSSQL time/datetime mismatch.
    List<Reservation> findByTable_IdAndReservationDateAndStatusNot(
            Long tableId, LocalDate reservationDate, String status);
}
