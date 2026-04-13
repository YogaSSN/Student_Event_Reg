package com.eventhub.faculty.controller;

import com.eventhub.faculty.entity.Faculty;
import com.eventhub.faculty.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.register(faculty));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String facultyId = credentials.get("facultyId");
        String password = credentials.get("password");
        Optional<Faculty> faculty = facultyService.login(facultyId, password);
        if (faculty.isPresent()) {
            return ResponseEntity.ok(faculty.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
