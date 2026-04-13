package com.eventhub.registration.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String studentId;
    private String studentName;
    private String email;
    private String department;
    private String year;
    private String phoneNumber;
    private String eventId;
    private String additionalDetails;
}
