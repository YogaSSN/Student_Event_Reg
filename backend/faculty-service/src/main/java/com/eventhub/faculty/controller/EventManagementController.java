package com.eventhub.faculty.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EventManagementController {

    private final String EVENT_SERVICE_URL = "http://localhost:8082/api/events";

    private RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/events/create")
    public ResponseEntity<?> createEvent(@RequestBody Object event) {
        return restTemplate.postForEntity(EVENT_SERVICE_URL + "/create", event, Object.class);
    }

    @PutMapping("/events/update/{id}")
    public void updateEvent(@PathVariable String id, @RequestBody Object event) {
        restTemplate.put(EVENT_SERVICE_URL + "/update/" + id, event);
    }

    @DeleteMapping("/events/delete/{id}")
    public void deleteEvent(@PathVariable String id) {
        restTemplate.delete(EVENT_SERVICE_URL + "/delete/" + id);
    }

    @PostMapping("/participation/approve")
    public ResponseEntity<?> approve(@RequestBody Map<String, String> body) {
        return restTemplate.postForEntity(EVENT_SERVICE_URL + "/participation/approve", body, Object.class);
    }

    @PostMapping("/participation/reject")
    public ResponseEntity<?> reject(@RequestBody Map<String, String> body) {
        return restTemplate.postForEntity(EVENT_SERVICE_URL + "/participation/reject", body, Object.class);
    }
}
