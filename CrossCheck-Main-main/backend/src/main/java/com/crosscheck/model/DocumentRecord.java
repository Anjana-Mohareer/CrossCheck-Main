package com.crosscheck.model;
import jakarta.persistence.*;import java.time.LocalDateTime;
@Entity @Table(name="documents") public class DocumentRecord{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; private Long candidateId; private String type; private String fileName; private String filePath; private String status="PENDING"; private LocalDateTime uploadedAt=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long v){id=v;} public Long getCandidateId(){return candidateId;} public void setCandidateId(Long v){candidateId=v;} public String getType(){return type;} public void setType(String v){type=v;} public String getFileName(){return fileName;} public void setFileName(String v){fileName=v;} public String getFilePath(){return filePath;} public void setFilePath(String v){filePath=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;} public LocalDateTime getUploadedAt(){return uploadedAt;}
}
