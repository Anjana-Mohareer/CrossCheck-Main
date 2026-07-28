package com.crosscheck.controller;

import com.crosscheck.service.AuditService;
import com.crosscheck.service.AuthService;
import com.crosscheck.service.EmailService;
import com.crosscheck.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    private final AuditService audit;
    private final EmailService emailService;
    private final UserRepository users;

    public AuthController(AuthService auth, AuditService audit, EmailService emailService, UserRepository users) {
        this.auth = auth;
        this.audit = audit;
        this.emailService = emailService;
        this.users = users;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        Map<String, Object> result = auth.register(body.get("name"), body.get("email"), body.get("password"), body.get("role"));
        Map<?, ?> user = (Map<?, ?>) result.get("user");
        audit.audit(String.valueOf(user.get("name")), "REGISTER", "USER", String.valueOf(user.get("id")),
                "New " + user.get("role") + " account registered");
        emailService.send(String.valueOf(user.get("email")), "Welcome To CrossCheck",
                "Hello " + user.get("name") + ",\n\nYour " + user.get("role") + " account has been registered successfully.\n" +
                "You will receive candidate and verification updates on this registered email address.\n\nRegards,\nCrossCheck Hiring Intelligence");
        return result;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Map<String, Object> result = auth.login(body.get("email"), body.get("password"));
        Map<?, ?> user = (Map<?, ?>) result.get("user");
        audit.audit(String.valueOf(user.get("name")), "LOGIN", "USER", String.valueOf(user.get("id")), "User logged in");
        return result;
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgot(@RequestBody Map<String, String> body) {
        String requestedEmail = body.getOrDefault("email", "").trim();
        users.findByEmailIgnoreCase(requestedEmail).ifPresent(user ->
                emailService.send(user.getEmail(), "CrossCheck Password Reset Request",
                        "Hello " + user.getName() + ",\n\nA password reset was requested for your CrossCheck account. " +
                        "Please contact your administrator to reset the password securely.\n\n" +
                        "If you did not request this, you can ignore this email.\n\nRegards,\nCrossCheck Hiring Intelligence"));
        return Map.of("message", "If the email is registered, reset instructions have been sent.");
    }

    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<String> conflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<String> invalid(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<String> unauthorized(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}
