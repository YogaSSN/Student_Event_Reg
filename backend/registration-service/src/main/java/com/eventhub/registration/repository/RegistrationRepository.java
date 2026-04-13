package com.eventhub.registration.repository;

import com.eventhub.registration.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByStudentId(String studentId);
    List<EventRegistration> findByEventId(String eventId);
}
