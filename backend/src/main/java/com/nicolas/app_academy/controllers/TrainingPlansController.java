package com.nicolas.app_academy.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nicolas.app_academy.dto.ExerciseDTO;
import com.nicolas.app_academy.dto.TrainingPlansDTO;
import com.nicolas.app_academy.services.TrainingPlansService;
import com.nicolas.app_academy.services.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/planos-treino")
@CrossOrigin("*")
@PreAuthorize("hasAnyAuthority('Admin','Colaborador', 'Unifit')")
public class TrainingPlansController {

  @Autowired
  private TrainingPlansService trainingPlansService;

  @PostMapping("/save")
  public ResponseEntity<?> createTrainingPlan(@RequestBody TrainingPlansDTO trainingPlansDTO) {
    try {
      TrainingPlansDTO newPlan = trainingPlansService.criarPlano(trainingPlansDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body(newPlan);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "Ocorreu um erro inesperado."));
    }
  }

  @GetMapping
  public ResponseEntity<List<TrainingPlansDTO>> listarPlanos() {
    try {
      List<TrainingPlansDTO> planos = trainingPlansService.getAllTrainingPlans();
      return ResponseEntity.ok(planos);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @PutMapping("/{trainingPlanId}")
  public ResponseEntity<?> atualizarPlano(
      @PathVariable Long trainingPlanId,
      @RequestBody @Valid TrainingPlansDTO trainingPlansDTO) {
    try {
      TrainingPlansDTO updatedPlan = trainingPlansService.atualizarPlano(trainingPlanId, trainingPlansDTO);
      return ResponseEntity.ok(updatedPlan);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("error", "Plano de treino não encontrado."));
    } catch (AccessDeniedException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body(Map.of("error", "Você não tem permissão para atualizar este plano."));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "Erro interno no servidor. Tente novamente mais tarde."));
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteTrainingPlan(
      @PathVariable Long id) {
    try {
      trainingPlansService.deletarPlano(id);
      return ResponseEntity.noContent().build();
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    } catch (AccessDeniedException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "Ocorreu um erro inesperado."));
    }
  }

  @PostMapping("/{trainingPlanId}/exercise")
  public ResponseEntity<ExerciseDTO> addExercise(
      @PathVariable Long trainingPlanId,
      @RequestBody ExerciseDTO exerciseDTO) {

    ExerciseDTO createdExercise = trainingPlansService.addExerciseToTrainingPlan(trainingPlanId, exerciseDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise);
  }

  @GetMapping("/{id}/exercise")
  public ResponseEntity<?> getTrainingPlanById(
      @PathVariable Long id) {
    try {
      TrainingPlansDTO trainingPlanDTO = trainingPlansService.getTrainingPlanById(id);
      return ResponseEntity.ok(trainingPlanDTO);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error",
          e.getMessage()));
    } catch (AccessDeniedException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error",
          e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "Ocorreu um erro inesperado."));
    }
  }
}
