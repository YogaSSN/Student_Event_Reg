package com.eventhub.registration.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
    name = "event_registrations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_event",
            columnNames = {"studentId", "eventId"}
        )
    }
)
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String year;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String eventId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String additionalDetails;
}

enum RegistrationStatus {
    PENDING, APPROVED, REJECTED
}
