package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.Role;
import com.ubt.restaurant.entity.User;
import com.ubt.restaurant.repository.RoleRepository;
import com.ubt.restaurant.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public UserController(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
    }

    private Map<String, Object> toView(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("roles", u.getRoles().stream().map(Role::getName).toList());
        m.put("roleIds", u.getRoles().stream().map(Role::getId).toList());
        return m;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return userRepo.findAll().stream().map(this::toView).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOne(@PathVariable Long id) {
        return userRepo.findById(id).map(u -> ResponseEntity.ok(toView(u))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String email = (String) body.get("email");
        String password = (String) body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "username and password required"));
        }
        if (userRepo.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }

        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(encoder.encode(password));
        u.setRoles(resolveRoles(body.get("roleIds")));
        return ResponseEntity.ok(toView(userRepo.save(u)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return userRepo.findById(id).<ResponseEntity<?>>map(existing -> {
            String username = (String) body.get("username");
            String email = (String) body.get("email");
            String password = (String) body.get("password");

            if (username != null) existing.setUsername(username);
            if (email != null) existing.setEmail(email);
            if (password != null && !password.isBlank()) existing.setPassword(encoder.encode(password));
            if (body.containsKey("roleIds")) existing.setRoles(resolveRoles(body.get("roleIds")));

            return ResponseEntity.ok(toView(userRepo.save(existing)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepo.existsById(id)) return ResponseEntity.notFound().build();
        userRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @SuppressWarnings("unchecked")
    private Set<Role> resolveRoles(Object raw) {
        Set<Role> roles = new HashSet<>();
        if (raw instanceof List<?> list) {
            for (Object id : list) {
                Long rid = ((Number) id).longValue();
                roleRepo.findById(rid).ifPresent(roles::add);
            }
        }
        return roles;
    }
}
