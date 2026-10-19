package com.nicolas.app_academy.utils;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nicolas.app_academy.entities.User;
import com.nicolas.app_academy.repositories.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtUserSyncFilter extends OncePerRequestFilter {

  @Autowired
  private UserRepository repository;

  @Autowired
  private final JwtUserUtils utils;

  public JwtUserSyncFilter(UserRepository repository, JwtUserUtils utils) {
    this.repository = repository;
    this.utils = utils;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {
    JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext()
        .getAuthentication();

    if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
      String userIdentifier = jwt.getSubject();

      var roles = utils.getRoles();
      repository.findUserByUserIdentifier(userIdentifier).orElseGet(() -> {
        User user = new User();
        user.setUserIdentifier(userIdentifier);
        user.setName(jwt.getClaimAsString("name"));
        user.setEmail(jwt.getClaimAsString("email"));
        user.setRoles(roles);

        return repository.save(user);
      });
    }
    filterChain.doFilter(request, response);
  }
}
