package com.bezkoder.spring.jpa.h2.payload;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank(message = "Benutzername darf nicht leer sein.") String username,
    @NotBlank(message = "Passwort darf nicht leer sein.") String password) {
}
