package com.xadazhii.server.controllers;

import javax.validation.Valid;
import com.xadazhii.server.payload.request.LoginRequest;
import com.xadazhii.server.payload.request.SignupRequest;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            return ResponseEntity.ok(authService.authenticateUser(loginRequest));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Nesprávne meno alebo heslo!"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            return ResponseEntity.ok(authService.registerUser(signUpRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
