package com.crosscheck.service;

import com.crosscheck.model.User;
import com.crosscheck.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {
    private static final Set<String> ALLOWED_ROLES = Set.of("ADMIN", "HR", "RECRUITER");
    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Map<String, User> sessions = new HashMap<>();

    public AuthService(UserRepository r) { repo = r; }

    public Map<String, Object> register(String name, String email, String password, String role) {
        String cleanName = name == null ? "" : name.trim();
        String cleanEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        String cleanRole = role == null ? "RECRUITER" : role.trim().toUpperCase(Locale.ROOT);

        if (cleanName.length() < 2) throw new IllegalArgumentException("Please enter a valid full name.");
        if (!cleanEmail.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
            throw new IllegalArgumentException("Please enter a valid email address.");
        if (password == null || password.length() < 8 || !password.matches(".*[A-Z].*") ||
                !password.matches(".*[a-z].*") || !password.matches(".*[0-9].*"))
            throw new IllegalArgumentException("Password must be at least 8 characters and include uppercase, lowercase and a number.");
        if (!ALLOWED_ROLES.contains(cleanRole)) throw new IllegalArgumentException("Invalid registration role.");
        if (repo.findByEmailIgnoreCase(cleanEmail).isPresent()) throw new IllegalStateException("An account with this email already exists.");

        User user = new User();
        user.setName(cleanName);
        user.setEmail(cleanEmail);
        user.setPassword(encoder.encode(password));
        user.setRole(cleanRole);
        user.setActive(true);
        user = repo.save(user);
        return createSession(user);
    }

    public Map<String, Object> login(String email, String password) {
        User u = repo.findByEmailIgnoreCase(email == null ? "" : email.trim())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!u.isActive() || password == null || !encoder.matches(password, u.getPassword()))
            throw new RuntimeException("Invalid credentials");
        return createSession(u);
    }

    private Map<String, Object> createSession(User user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, user);
        return Map.of("token", token, "user", userView(user));
    }

    public Map<String, Object> userView(User user) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", user.getId()); view.put("name", user.getName()); view.put("email", user.getEmail());
        view.put("role", user.getRole()); view.put("phone", user.getPhone());
        view.put("designation", user.getDesignation()); view.put("photoDataUrl", user.getPhotoDataUrl());
        return view;
    }

    public User require(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) throw new RuntimeException("Unauthorized");
        User u = sessions.get(auth.substring(7));
        if (u == null) throw new RuntimeException("Unauthorized");
        return u;
    }

    public String encode(String p) { return encoder.encode(p); }
}
