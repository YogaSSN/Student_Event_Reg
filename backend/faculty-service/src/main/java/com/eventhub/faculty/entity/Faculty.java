package com.eventhub.faculty.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "faculty")
public class Faculty {
    @Id
    private String facultyId;
    private String name;
    private String email;
    private String password;
    private String department;
}
