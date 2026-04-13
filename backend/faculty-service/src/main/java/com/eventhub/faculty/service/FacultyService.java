package com.eventhub.faculty.service;

import com.eventhub.faculty.entity.Faculty;
import com.eventhub.faculty.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Faculty register(Faculty faculty) {
        faculty.setPassword(passwordEncoder.encode(faculty.getPassword()));
        return facultyRepository.save(faculty);
    }

    public Optional<Faculty> login(String facultyId, String password) {
        Optional<Faculty> faculty = facultyRepository.findById(facultyId);
        if (faculty.isPresent() && passwordEncoder.matches(password, faculty.get().getPassword())) {
            return faculty;
        }
        return Optional.empty();
    }
}
