package com.xadazhii.server.controllers;

import com.xadazhii.server.models.CalendarEvent;
import com.xadazhii.server.services.CalendarEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    @Autowired
    private CalendarEventService calendarEventService;

    @GetMapping
    public List<CalendarEvent> getAllEvents() {
        return calendarEventService.getAllEvents();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CalendarEvent> createEvent(@RequestBody @lombok.NonNull CalendarEvent event) {
        return ResponseEntity.ok(calendarEventService.createEvent(event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable @lombok.NonNull Long id) {
        try {
            calendarEventService.deleteEvent(id);
            return ResponseEntity.ok("Udalosť bola úspešne vymazaná!");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}