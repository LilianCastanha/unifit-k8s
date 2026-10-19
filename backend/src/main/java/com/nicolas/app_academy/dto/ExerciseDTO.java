package com.nicolas.app_academy.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import com.nicolas.app_academy.entities.Exercise;

@Data
@NoArgsConstructor
public class ExerciseDTO implements Serializable {
  private Long id;
  private String exerciseName;
  private String exerciseDescription;
  private Integer seriesQuantity;
  private Integer repetitionsQuantity;
  private Integer weightUsed;
  private Integer restTime;
  private Long trainingPlanId;

  public ExerciseDTO(Exercise exercise) {
    this.id = exercise.getId();
    this.exerciseName = exercise.getExerciseName();
    this.exerciseDescription = exercise.getExerciseDescription();
    this.seriesQuantity = exercise.getSeriesQuantity();
    this.repetitionsQuantity = exercise.getRepetitionsQuantity();
    this.weightUsed = exercise.getWeightUsed();
    this.restTime = exercise.getRestTime();
    this.trainingPlanId = exercise.getTrainingPlans() != null ? exercise.getTrainingPlans().getId() : null;
  }
}
