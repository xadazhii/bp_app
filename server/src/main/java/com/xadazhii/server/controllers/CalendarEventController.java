package com.xadazhii.server.controllers;

import com.xadazhii.server.models.CalendarEvent;
import com.xadazhii.server.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"https://btsss-stu-fei.netlify.app", "http://localhost:3000"}, maxAge = 3600)
@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    @GetMapping
    public List<CalendarEvent> getAllEvents() {
        return calendarEventRepository.findAllByOrderByEventDateAsc();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CalendarEvent> createEvent(@RequestBody CalendarEvent event) {
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return ResponseEntity.ok(savedEvent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (!calendarEventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        calendarEventRepository.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully!");
    }
}