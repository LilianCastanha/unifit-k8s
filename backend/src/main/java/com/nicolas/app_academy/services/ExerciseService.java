package com.nicolas.app_academy.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nicolas.app_academy.dto.ExerciseDTO;
import com.nicolas.app_academy.entities.Exercise;
import com.nicolas.app_academy.entities.TrainingPlans;
import com.nicolas.app_academy.repositories.ExerciseRepository;
import com.nicolas.app_academy.repositories.TrainingPlansRepository;
import com.nicolas.app_academy.services.exception.ResourceNotFoundException;

@Service
public class ExerciseService {

  @Autowired
  private ExerciseRepository exerciseRepository;

  @Autowired
  private TrainingPlansRepository trainingPlansRepository;

  public ExerciseDTO criarExercicio(ExerciseDTO exerciseDTO) {
    Exercise exercise = new Exercise();
    exercise.setExerciseName(exerciseDTO.getExerciseName());
    exercise.setExerciseDescription(exerciseDTO.getExerciseDescription());
    exercise.setSeriesQuantity(exerciseDTO.getSeriesQuantity());
    exercise.setRepetitionsQuantity(exerciseDTO.getRepetitionsQuantity());
    exercise.setWeightUsed(exerciseDTO.getWeightUsed());
    exercise.setRestTime(exerciseDTO.getRestTime());

    if (exerciseDTO.getTrainingPlanId() != null) {
      TrainingPlans trainingPlan = trainingPlansRepository.findById(exerciseDTO.getTrainingPlanId())
          .orElseThrow(() -> new ResourceNotFoundException(
              "Plano de treino nao encontrado"));
      exercise.setTrainingPlans(trainingPlan);
    }

    Exercise exerciseSaved = exerciseRepository.save(exercise);

    return new ExerciseDTO(exerciseSaved);
  }

  public List<ExerciseDTO> listarExercicios() {
    return exerciseRepository.findAll().stream().map(exercise -> {
      return new ExerciseDTO(exercise);
    }).collect(Collectors.toList());

  }

  public ExerciseDTO atualizarExercicio(Long exerciseId, ExerciseDTO exerciseDTO) {
    Exercise exercise = exerciseRepository.findById(exerciseId)
        .orElseThrow(() -> new ResourceNotFoundException("Exercicio nao encontrado"));

    exercise.setExerciseName(exerciseDTO.getExerciseName());
    exercise.setExerciseDescription(exerciseDTO.getExerciseDescription());
    exercise.setSeriesQuantity(exerciseDTO.getSeriesQuantity());
    exercise.setRepetitionsQuantity(exerciseDTO.getRepetitionsQuantity());
    exercise.setWeightUsed(exerciseDTO.getWeightUsed());
    exercise.setRestTime(exerciseDTO.getRestTime());

    if (exerciseDTO.getTrainingPlanId() != null) {
      TrainingPlans trainingPlan = trainingPlansRepository.findById(exerciseDTO.getTrainingPlanId())
          .orElseThrow(() -> new ResourceNotFoundException("Plano de treino nao encontrado"));
      exercise.setTrainingPlans(trainingPlan);
    }

    Exercise exerciseUpdated = exerciseRepository.save(exercise);
    return new ExerciseDTO(exerciseUpdated);
  }

  public void deletarExercicio(Long exerciseId) {
    if (!exerciseRepository.existsById(exerciseId)) {
      throw new ResourceNotFoundException("Exercicio nao encontrado");
    }
    exerciseRepository.deleteById(exerciseId);
  }

  public List<ExerciseDTO> getExercisesByIds(List<Long> ids) {
    List<Exercise> exercises = exerciseRepository.findAllById(ids);
    return exercises.stream()
        .map(ExerciseDTO::new)
        .collect(Collectors.toList());
  }

}
