package com.restaurant.management.controller;

import com.restaurant.management.entity.MenuCategory;
import com.restaurant.management.repository.MenuCategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-categories")
public class MenuCategoryController {

    private final MenuCategoryRepository repo;

    public MenuCategoryController(MenuCategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<MenuCategory> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public MenuCategory create(@RequestBody MenuCategory c) {
        return repo.save(c);
    }
}