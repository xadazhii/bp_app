package com.xadazhii.server.controllers;

import com.xadazhii.server.payload.request.ProgressRequest;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.payload.response.UserStatsResponse;
import com.xadazhii.server.security.details.UserDetailsImpl;
import com.xadazhii.server.services.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/progress/completed-ids")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<Long>> getCompletedMaterialIds() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(progressService.getCompletedMaterialIds(userDetails.getId()));
    }

    @PostMapping("/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsCompleted(@Valid @RequestBody ProgressRequest progressRequest) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            progressService.markAsCompleted(userDetails.getId(), progressRequest.getMaterialId());
            return ResponseEntity.ok(new MessageResponse("Materiál bol úspešne označený ako dokončený!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getUserStats(userId));
    }
}
