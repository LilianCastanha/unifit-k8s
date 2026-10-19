package com.nicolas.app_academy.utils;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import com.nicolas.app_academy.entities.User;
import com.nicolas.app_academy.repositories.UserRepository;
import com.nicolas.app_academy.services.exception.ResourceNotFoundException;

@Component
public class JwtUserUtils {

  @Autowired
  private UserRepository repository;

  public User getLoggedUser() {
    JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder
        .getContext().getAuthentication();

    if (authentication == null || authentication.getToken() == null) {
      return null;
    }
    String identifier = authentication.getToken().getSubject();

    return repository.findUserByUserIdentifier(identifier)
        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
  }

  public List<String> getRoles() {
    JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext()
        .getAuthentication();
    Collection<GrantedAuthority> authorities = authentication.getAuthorities();
    return authorities.stream()
        .map(GrantedAuthority::getAuthority)
        .filter(role -> role.equals("Colaborador") || role.equals("Admin") || role.equals("Unifit"))
        .collect(Collectors.toList());
  }
}
