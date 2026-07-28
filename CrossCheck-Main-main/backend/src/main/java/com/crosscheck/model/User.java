package com.crosscheck.model;
import jakarta.persistence.*;
@Entity @Table(name="users") public class User{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(unique=true,nullable=false) private String email;
 @Column(nullable=false) private String password;
 @Column(nullable=false) private String role;
 private String phone;
 private String designation;
 @Lob @Column(columnDefinition="LONGTEXT") private String photoDataUrl;
 private boolean active=true;
 public Long getId(){return id;} public void setId(Long id){this.id=id;}
 public String getName(){return name;} public void setName(String v){name=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public String getRole(){return role;} public void setRole(String v){role=v;}
 public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
 public String getDesignation(){return designation;} public void setDesignation(String v){designation=v;}
 public String getPhotoDataUrl(){return photoDataUrl;} public void setPhotoDataUrl(String v){photoDataUrl=v;}
 public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}
