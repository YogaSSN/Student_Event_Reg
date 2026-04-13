package com.eventhub.registration.service;

import com.eventhub.registration.entity.EventRegistration;
import com.eventhub.registration.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository repository;

    public EventRegistration register(EventRegistration registration) {
        return repository.save(registration);
    }

    public List<EventRegistration> getByStudentId(String studentId) {
        return repository.findByStudentId(studentId);
    }

    public List<EventRegistration> getByEventId(String eventId) {
        return repository.findByEventId(eventId);
    }

    public EventRegistration approve(Long id) {
        EventRegistration reg = repository.findById(id).orElseThrow();
        reg.setStatus(com.eventhub.registration.entity.RegistrationStatus.APPROVED);
        return repository.save(reg);
    }

    public EventRegistration reject(Long id) {
        EventRegistration reg = repository.findById(id).orElseThrow();
        reg.setStatus(com.eventhub.registration.entity.RegistrationStatus.REJECTED);
        return repository.save(reg);
    }
}
