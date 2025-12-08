package com.bezkoder.spring.jpa.h2.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bezkoder.spring.jpa.h2.model.Editor;
import com.bezkoder.spring.jpa.h2.repository.EditorRepository;

@Service
public class EditorDetailsService implements UserDetailsService {

  private final EditorRepository editorRepository;

  public EditorDetailsService(EditorRepository editorRepository) {
    this.editorRepository = editorRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Editor editor = editorRepository.findByUsernameIgnoreCase(username)
        .orElseThrow(() -> new UsernameNotFoundException("Redakteur wurde nicht gefunden."));

    return User.builder()
        .username(editor.getUsername())
        .password(editor.getPasswordHash())
        .roles("EDITOR")
        .build();
  }
}
