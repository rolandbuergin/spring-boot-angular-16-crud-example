package com.bezkoder.spring.jpa.h2.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.spring.jpa.h2.model.Editor;

public interface EditorRepository extends JpaRepository<Editor, Long> {

  Optional<Editor> findByUsernameIgnoreCase(String username);

  boolean existsByUsernameIgnoreCase(String username);
}
