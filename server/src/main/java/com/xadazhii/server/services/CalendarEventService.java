package com.xadazhii.server.services;

import com.xadazhii.server.models.CalendarEvent;
import com.xadazhii.server.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarEventService {

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    public List<CalendarEvent> getAllEvents() {
        return calendarEventRepository.findAllByOrderByEventDateAsc();
    }

    public CalendarEvent createEvent(CalendarEvent event) {
        return java.util.Objects.requireNonNull(calendarEventRepository.save(java.util.Objects.requireNonNull(event)));
    }

    public void deleteEvent(Long id) {
        if (!calendarEventRepository.existsById(java.util.Objects.requireNonNull(id))) {
            throw new RuntimeException("Udalosť nebol nájdená.");
        }
        calendarEventRepository.deleteById(java.util.Objects.requireNonNull(id));
    }
}
