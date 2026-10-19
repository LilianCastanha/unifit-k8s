package com.nicolas.app_academy.controllers;

import com.nicolas.app_academy.dto.ExerciseDTO;
import com.nicolas.app_academy.services.ExerciseService;
import com.nicolas.app_academy.services.exception.ResourceNotFoundException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exercicios")
@CrossOrigin({ "*" })
@PreAuthorize("hasAnyAuthority('Admin','Colaborador', 'Unifit')")
public class ExerciseController {

  @Autowired
  private ExerciseService exerciseService;

  @PostMapping("/save")
  public ResponseEntity<ExerciseDTO> criarExercicio(@RequestBody ExerciseDTO exerciseDTO) {
    try {
      ExerciseDTO createdExercise = exerciseService.criarExercicio(exerciseDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @GetMapping
  public ResponseEntity<List<ExerciseDTO>> listarExercicios() {
    try {
      List<ExerciseDTO> exercises = exerciseService.listarExercicios();
      return ResponseEntity.status(HttpStatus.OK).body(exercises);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @PutMapping("/{exerciseId}")
  public ResponseEntity<ExerciseDTO> atualizarExercicio(@PathVariable Long exerciseId,
      @RequestBody ExerciseDTO exerciseDTO) {
    try {
      ExerciseDTO updatedExercise = exerciseService.atualizarExercicio(exerciseId, exerciseDTO);
      return ResponseEntity.status(HttpStatus.OK).body(updatedExercise);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @DeleteMapping("/{exerciseId}")
  public ResponseEntity<Void> deletarExercicio(@PathVariable Long exerciseId) {
    try {
      exerciseService.deletarExercicio(exerciseId);
      return ResponseEntity.noContent().build();
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
