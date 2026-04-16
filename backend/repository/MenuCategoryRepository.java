package com.ubt.restaurant.repository;

import com.ubt.restaurant.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {}
