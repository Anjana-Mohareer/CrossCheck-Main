package com.crosscheck.controller;

import com.crosscheck.model.User;
import com.crosscheck.repository.UserRepository;
import com.crosscheck.service.AuditService;
import com.crosscheck.service.AuthService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final AuthService auth; private final UserRepository users; private final AuditService audit;
    public ProfileController(AuthService auth, UserRepository users, AuditService audit){this.auth=auth;this.users=users;this.audit=audit;}

    @GetMapping
    public Map<String,Object> get(@RequestHeader(value="Authorization", required=false) String header){
        return auth.userView(auth.require(header));
    }

    @PutMapping
    public Map<String,Object> update(@RequestHeader(value="Authorization", required=false) String header, @RequestBody Map<String,String> body){
        User user=auth.require(header);
        String name=body.getOrDefault("name","").trim();
        if(name.length()<2) throw new IllegalArgumentException("Please enter a valid full name.");
        user.setName(name);
        user.setPhone(body.getOrDefault("phone","").trim());
        user.setDesignation(body.getOrDefault("designation","").trim());
        String photo=body.get("photoDataUrl");
        if(photo!=null && photo.length()>4_000_000) throw new IllegalArgumentException("Profile photo is too large. Please use an image below 3 MB.");
        user.setPhotoDataUrl(photo);
        users.save(user);
        audit.audit(user.getName(),"UPDATE","USER",String.valueOf(user.getId()),"Profile information updated");
        return auth.userView(user);
    }
}
