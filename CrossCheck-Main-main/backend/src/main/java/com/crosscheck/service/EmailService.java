package com.crosscheck.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${crosscheck.mail.enabled:false}")
    private boolean enabled;

    @Value("${crosscheck.mail.from:${spring.mail.username:no-reply@crosscheck.local}}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String recipient, String subject, String body) {
        if (recipient == null || recipient.isBlank() || !recipient.contains("@")) return;
        if (!enabled) {
            log.info("EMAIL PREVIEW -> To: {} | Subject: {} | Body: {}", recipient, subject, body.replace("\n", " | "));
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(recipient.trim());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            // Email failure must never stop candidate or verification updates.
            log.error("Unable to send CrossCheck email to {}: {}", recipient, ex.getMessage());
        }
    }

    public void sendToAll(Iterable<String> recipients, String subject, String body) {
        Set<String> unique = new LinkedHashSet<>();
        for (String recipient : recipients) {
            if (recipient != null && !recipient.isBlank()) unique.add(recipient.trim().toLowerCase());
        }
        unique.forEach(recipient -> send(recipient, subject, body));
    }

    public String candidateMessage(String candidateName, String update, String details) {
        return "Hello " + safe(candidateName) + ",\n\n" +
                "Your CrossCheck profile has an update: " + update + ".\n" +
                (details == null || details.isBlank() ? "" : details + "\n") +
                "\nPlease contact the HR team if any information needs correction.\n\n" +
                "Regards,\nCrossCheck Hiring Intelligence";
    }

    private String safe(String value) { return value == null || value.isBlank() ? "Candidate" : value; }
}
