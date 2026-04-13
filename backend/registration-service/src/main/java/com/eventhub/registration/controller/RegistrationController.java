package com.eventhub.registration.controller;

import com.eventhub.registration.entity.EventRegistration;
import com.eventhub.registration.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    @Autowired
    private RegistrationService service;

    @PostMapping("/register")
    public ResponseEntity<EventRegistration> register(@RequestBody EventRegistration registration) {
        return ResponseEntity.ok(service.register(registration));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EventRegistration>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(service.getByStudentId(studentId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRegistration>> getByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(service.getByEventId(eventId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<EventRegistration> approve(@PathVariable Long id) {
        return ResponseEntity.ok(service.approve(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<EventRegistration> reject(@PathVariable Long id) {
        return ResponseEntity.ok(service.reject(id));
    }
}
