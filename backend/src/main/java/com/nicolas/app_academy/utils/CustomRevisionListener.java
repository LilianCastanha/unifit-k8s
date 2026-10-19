package com.nicolas.app_academy.utils;

import com.nicolas.app_academy.entities.CustomRevisionEntity;
import org.hibernate.envers.RevisionListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class CustomRevisionListener implements RevisionListener {

  @Override
  public void newRevision(Object revisionEntity) {
    CustomRevisionEntity rev = (CustomRevisionEntity) revisionEntity;

    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth instanceof JwtAuthenticationToken token) {
      String name = token.getToken().getClaimAsString("name");
      rev.setUsername(name);
    }
  }
}
