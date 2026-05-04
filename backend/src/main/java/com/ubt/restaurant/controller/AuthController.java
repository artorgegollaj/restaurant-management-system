package com.ubt.restaurant.controller;

import com.ubt.restaurant.entity.RefreshToken;
import com.ubt.restaurant.entity.Role;
import com.ubt.restaurant.entity.User;
import com.ubt.restaurant.repository.RoleRepository;
import com.ubt.restaurant.repository.UserRepository;
import com.ubt.restaurant.security.JwtService;
import com.ubt.restaurant.security.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshService;

    public AuthController(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder encoder,
                          AuthenticationManager authManager, JwtService jwtService, RefreshTokenService refreshService) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.refreshService = refreshService;
    }

    public record RegisterRequest(
        @NotBlank(message = "Username eshte i detyrueshem")
        @Size(min = 3, max = 50, message = "Username 3-50 karaktere")
        String username,

        @NotBlank @Email(message = "Email i pavlefshem")
        String email,

        @NotBlank @Size(min = 6, message = "Min 6 karaktere")
        String password
    ) {}

    public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
    ) {}

    public record RefreshRequest(@NotBlank String refreshToken) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.existsByUsername(req.username())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }
        if (userRepo.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already used"));
        }
        Role role = roleRepo.findByName("USER").orElseGet(() -> roleRepo.save(new Role("USER")));
        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setPassword(encoder.encode(req.password()));
        user.setRoles(Set.of(role));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        User user = userRepo.findByUsername(req.username()).orElseThrow();
        String accessToken = jwtService.generateAccessToken(req.username());
        RefreshToken refreshToken = refreshService.create(user);
        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken.getToken(),
            "username", user.getUsername(),
            "roles", user.getRoles().stream().map(Role::getName).toList()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        return refreshService.findByToken(token)
                .map(rt -> {
                    if (!refreshService.isValid(rt)) {
                        return ResponseEntity.status(401).body(Map.of("error", "Refresh token expired"));
                    }
                    refreshService.revoke(rt);
                    RefreshToken newRt = refreshService.create(rt.getUser());
                    String newAccess = jwtService.generateAccessToken(rt.getUser().getUsername());
                    Map<String, Object> res = new HashMap<>();
                    res.put("accessToken", newAccess);
                    res.put("refreshToken", newRt.getToken());
                    return ResponseEntity.ok((Object) res);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token")));
    }

   @PostMapping("/logout")
public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
    String token = body.get("refreshToken");
    if (token == null || token.isBlank()) {
        return ResponseEntity.badRequest().body(Map.of("error", "refreshToken eshte i detyrueshem"));
    }
    var found = refreshService.findByToken(token);
    if (found.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("error", "Token nuk u gjet"));
    }
    refreshService.revoke(found.get());
    return ResponseEntity.ok(Map.of("message", "Logged out", "revokedAt", java.time.Instant.now().toString()));
}

@PostMapping("/logout-all")
public ResponseEntity<?> logoutAll(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    var user = userRepo.findByUsername(username).orElseThrow();
    refreshService.revokeAllForUser(user);
    return ResponseEntity.ok(Map.of("message", "All sessions logged out for " + username));
}
}
