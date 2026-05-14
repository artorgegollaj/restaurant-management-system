package com.ubt.restaurant.config;

import com.ubt.restaurant.entity.MenuCategory;
import com.ubt.restaurant.entity.MenuItem;
import com.ubt.restaurant.entity.RestaurantTable;
import com.ubt.restaurant.entity.Role;
import com.ubt.restaurant.entity.User;
import com.ubt.restaurant.repository.MenuCategoryRepository;
import com.ubt.restaurant.repository.MenuItemRepository;
import com.ubt.restaurant.repository.RestaurantTableRepository;
import com.ubt.restaurant.repository.RoleRepository;
import com.ubt.restaurant.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final MenuCategoryRepository catRepo;
    private final MenuItemRepository itemRepo;
    private final RestaurantTableRepository tableRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository userRepo, RoleRepository roleRepo,
                      MenuCategoryRepository catRepo, MenuItemRepository itemRepo,
                      RestaurantTableRepository tableRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.catRepo = catRepo;
        this.itemRepo = itemRepo;
        this.tableRepo = tableRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        Role admin = roleRepo.findByName("ADMIN").orElseGet(() -> roleRepo.save(new Role("ADMIN")));
        roleRepo.findByName("MANAGER").orElseGet(() -> roleRepo.save(new Role("MANAGER")));
        roleRepo.findByName("WAITER").orElseGet(() -> roleRepo.save(new Role("WAITER")));
        roleRepo.findByName("USER").orElseGet(() -> roleRepo.save(new Role("USER")));

        if (!userRepo.existsByUsername("admin")) {
            User u = new User();
            u.setUsername("admin");
            u.setEmail("admin@restaurant.local");
            u.setPassword(encoder.encode("admin123"));
            u.setRoles(Set.of(admin));
            userRepo.save(u);
        }

        if (catRepo.count() == 0) {
            MenuCategory pje = new MenuCategory(); pje.setName("Pjate kryesore"); catRepo.save(pje);
            MenuCategory ant = new MenuCategory(); ant.setName("Antipasta"); catRepo.save(ant);
            MenuCategory pij = new MenuCategory(); pij.setName("Pije"); catRepo.save(pij);
            MenuCategory emb = new MenuCategory(); emb.setName("Embelsira"); catRepo.save(emb);

            MenuItem m1 = new MenuItem(); m1.setName("Tave kosi"); m1.setPrice(new BigDecimal("6.50")); m1.setCategory(pje); m1.setAvailable(true); itemRepo.save(m1);
            MenuItem m2 = new MenuItem(); m2.setName("Pizza Margarita"); m2.setPrice(new BigDecimal("5.00")); m2.setCategory(pje); m2.setAvailable(true); itemRepo.save(m2);
            MenuItem m3 = new MenuItem(); m3.setName("Sallate Greke"); m3.setPrice(new BigDecimal("3.50")); m3.setCategory(ant); m3.setAvailable(true); itemRepo.save(m3);
            MenuItem m4 = new MenuItem(); m4.setName("Coca-Cola 0.5L"); m4.setPrice(new BigDecimal("1.50")); m4.setCategory(pij); m4.setAvailable(true); itemRepo.save(m4);
            MenuItem m5 = new MenuItem(); m5.setName("Tiramisu"); m5.setPrice(new BigDecimal("3.00")); m5.setCategory(emb); m5.setAvailable(true); itemRepo.save(m5);
        }

        if (tableRepo.count() == 0) {
            for (int i = 1; i <= 10; i++) {
                RestaurantTable t = new RestaurantTable();
                t.setTableNumber(i);
                t.setCapacity(i % 2 == 0 ? 4 : 2);
                t.setStatus("FREE");
                tableRepo.save(t);
            }
        }
    }
}
