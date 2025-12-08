package com.bezkoder.spring.jpa.h2.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.spring.jpa.h2.model.Editor;
import com.bezkoder.spring.jpa.h2.payload.AuthRequest;
import com.bezkoder.spring.jpa.h2.repository.EditorRepository;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/auth")
@Validated
public class AuthController {

  private final EditorRepository editorRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;

  public AuthController(EditorRepository editorRepository, PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager) {
    this.editorRepository = editorRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@Valid @RequestBody AuthRequest request) {
    String username = request.username().trim();

    if (editorRepository.existsByUsernameIgnoreCase(username)) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body("Benutzername ist bereits vergeben.");
    }

    Editor editor = new Editor(username, passwordEncoder.encode(request.password()));
    editorRepository.save(editor);

    return ResponseEntity.status(HttpStatus.CREATED).body("Registrierung erfolgreich.");
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@Valid @RequestBody AuthRequest request) {
    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.username(), request.password()));

      if (authentication.isAuthenticated()) {
        return ResponseEntity.ok("Anmeldung erfolgreich.");
      }
    } catch (AuthenticationException ex) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Benutzername oder Passwort ist falsch.");
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Benutzername oder Passwort ist falsch.");
  }
}
