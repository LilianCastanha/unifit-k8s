package com.nicolas.app_academy.services;

import org.springframework.http.ResponseEntity;

import com.nicolas.app_academy.dto.Login;
import com.nicolas.app_academy.dto.Register;

public interface ILoginService<T> {
  ResponseEntity<T> login(Login login);

  ResponseEntity<T> register(Register register);
}