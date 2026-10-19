package com.nicolas.app_academy.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import com.nicolas.app_academy.utils.JwtUserUtils;

import java.util.Optional;

@Component("auditorAware")
public class AuditorAwareImpl implements AuditorAware<String> {

  @Autowired
  private JwtUserUtils utils;

  @Override
  public Optional<String> getCurrentAuditor() {
    try {
      var user = utils.getLoggedUser();
      return Optional.ofNullable(user.getUserIdentifier());
    } catch (Exception e) {
      return Optional.of("anonymous");
    }
  }
}