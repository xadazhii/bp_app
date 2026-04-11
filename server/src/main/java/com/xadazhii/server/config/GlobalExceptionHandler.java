package com.xadazhii.server.config;

import com.xadazhii.server.payload.response.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MessageResponse> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<MessageResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(new MessageResponse("Chyba: Neautorizovaný prístup"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleGeneralException(Exception ex) {
        return ResponseEntity.status(500).body(new MessageResponse("Interná chyba servera: " + ex.getMessage()));
    }
}