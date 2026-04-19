package com.ubt.restaurant.config;

import com.ubt.restaurant.entity.Role;
import com.ubt.restaurant.entity.User;
import com.ubt.restaurant.repository.RoleRepository;
import com.ubt.restaurant.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        Role admin = roleRepo.findByName("ADMIN").orElseGet(() -> roleRepo.save(new Role("ADMIN")));
        roleRepo.findByName("USER").orElseGet(() -> roleRepo.save(new Role("USER")));

        if (!userRepo.existsByUsername("admin")) {
            User u = new User();
            u.setUsername("admin");
            u.setEmail("admin@restaurant.local");
            u.setPassword(encoder.encode("admin123"));
            u.setRoles(Set.of(admin));
            userRepo.save(u);
        }
    }
}
