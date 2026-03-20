package com.xadazhii.server.services;

import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.User;
import com.xadazhii.server.payload.request.LoginRequest;
import com.xadazhii.server.payload.request.SignupRequest;
import com.xadazhii.server.payload.response.JwtResponse;
import com.xadazhii.server.repository.AllowedStudentRepository;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.security.jwt.JwtUtils;
import com.xadazhii.server.security.details.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AllowedStudentRepository allowedStudentRepository;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles);
    }

    @org.springframework.transaction.annotation.Transactional
    public void registerUser(SignupRequest signUpRequest) {
        if (!allowedStudentRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Registrácia je povolená len pre študentov zo zoznamu.");
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Chyba: Používateľské meno je už obsadené!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Chyba: Email je už obsadený!");
        }

        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Chyba: Predvolená rola (ROLE_USER) nebola nájdená."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);
    }
}
