package com.nicolas.app_academy.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class LogController {

  @GetMapping("/test-log")
  public String testLog() {
    log.info("START - TESTE Log");
    log.info("END - TESTE log");
    return "Logs gerados!";
  }
}
