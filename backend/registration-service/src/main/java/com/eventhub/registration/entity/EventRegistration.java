package com.eventhub.registration.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "event_registrations")
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;
    private String studentName;
    private String email;
    private String department;
    private String year;
    private String phoneNumber;
    private String eventId;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String additionalDetails;
}

enum RegistrationStatus {
    PENDING, APPROVED, REJECTED
}
