package com.nicolas.app_academy.controllers;

import com.nicolas.app_academy.dto.AuditAllHistoryDTO;
import com.nicolas.app_academy.dto.ExerciseAuditDTO;
import com.nicolas.app_academy.dto.TrainingPlanAuditDTO;
import com.nicolas.app_academy.services.AuditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audition")
@CrossOrigin("*")
public class AuditionController {

  @Autowired
  private AuditionService auditionService;

  @GetMapping("/training-plan/{id}")
  public ResponseEntity<List<TrainingPlanAuditDTO>> getAuditHistory(@PathVariable Long id) {
    List<TrainingPlanAuditDTO> history = auditionService.getTrainingPlanAuditHistory(id);
    return ResponseEntity.ok(history);
  }

  @GetMapping("/exercise/{id}")
  public ResponseEntity<List<ExerciseAuditDTO>> getExerciseAuditHistory(@PathVariable Long id) {
    List<ExerciseAuditDTO> history = auditionService.getExerciseAuditHistory(id);
    return ResponseEntity.ok(history);
  }

  @GetMapping
  public ResponseEntity<List<AuditAllHistoryDTO>> getAllAuditHistory() {
    return ResponseEntity.ok(auditionService.getAllAuditHistory());
  }
}
