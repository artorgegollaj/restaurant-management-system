package com.restaurant.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MenuCategories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String emertimi;
    private String pershkrimi;
}
