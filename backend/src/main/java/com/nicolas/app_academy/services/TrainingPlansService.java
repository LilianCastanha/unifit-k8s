package com.nicolas.app_academy.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.nicolas.app_academy.dto.ExerciseDTO;
import com.nicolas.app_academy.dto.TrainingPlansDTO;
import com.nicolas.app_academy.entities.Exercise;
import com.nicolas.app_academy.entities.TrainingPlans;
import com.nicolas.app_academy.entities.User;
import com.nicolas.app_academy.repositories.ExerciseRepository;
import com.nicolas.app_academy.repositories.TrainingPlansRepository;
import com.nicolas.app_academy.repositories.UserRepository;
import com.nicolas.app_academy.services.exception.ResourceNotFoundException;
import com.nicolas.app_academy.utils.JwtUserUtils;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TrainingPlansService {

  @Autowired
  private TrainingPlansRepository trainingPlansRepository;

  @Autowired
  private ExerciseRepository exerciseRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ExerciseService exerciseService;

  @Autowired
  private JwtUserUtils utils;

  public TrainingPlansDTO criarPlano(TrainingPlansDTO trainingPlanDTO) {
    User user = utils.getLoggedUser();
    
    TrainingPlans trainingPlan = new TrainingPlans();
    trainingPlan.setPlanName(trainingPlanDTO.getPlanName());
    trainingPlan.setPlanDescription(trainingPlanDTO.getPlanDescription());
    trainingPlan.setDuration(trainingPlanDTO.getDuration());

    if (!user.equals(null)) {
      trainingPlan.setUser(user);
    } else {
      trainingPlan.setUser(null);
    }

    List<Exercise> exercises = new ArrayList<>();

    if (trainingPlanDTO.getExerciseIds() != null && !trainingPlanDTO.getExerciseIds().isEmpty()) {
      for (Long exerciseId : trainingPlanDTO.getExerciseIds()) {
        Exercise existingExercise = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new ResourceNotFoundException("Exercicio nao encontrado"));

        existingExercise.setTrainingPlans(trainingPlan);
        exercises.add(existingExercise);
      }
    }

    TrainingPlans trainingPlanSaved = trainingPlansRepository.save(trainingPlan);

    user.getTrainingPlans().add(trainingPlanSaved);
    userRepository.save(user);

    if (trainingPlanDTO.getNewExercises() != null && !trainingPlanDTO.getNewExercises().isEmpty()) {
      for (ExerciseDTO newExerciseDTO : trainingPlanDTO.getNewExercises()) {
        Exercise newExercise = new Exercise();
        newExercise.setExerciseName(newExerciseDTO.getExerciseName());
        newExercise.setExerciseDescription(newExerciseDTO.getExerciseDescription());
        newExercise.setSeriesQuantity(newExerciseDTO.getSeriesQuantity());
        newExercise.setRepetitionsQuantity(newExerciseDTO.getRepetitionsQuantity());
        newExercise.setWeightUsed(newExerciseDTO.getWeightUsed());
        newExercise.setRestTime(newExerciseDTO.getRestTime());
        newExercise.setTrainingPlans(trainingPlanSaved);

        exercises.add(newExercise);
      }

      trainingPlanSaved.setExerciseList(exercises);
      exerciseRepository.saveAll(exercises);
      trainingPlansRepository.save(trainingPlanSaved);
    }
    return new TrainingPlansDTO(trainingPlanSaved, true);
  }

  public TrainingPlansDTO atualizarPlano(Long trainingPlanId, TrainingPlansDTO trainingPlanDTO) {
    User loggedUser = utils.getLoggedUser();
    TrainingPlans trainingPlan = trainingPlansRepository.findById(trainingPlanId)
        .orElseThrow(() -> new ResourceNotFoundException("Plano de treino nao encontrado"));

    boolean isOwner = trainingPlan.getUser().getId().equals(loggedUser.getId());

    if (!isOwner) {
      throw new AccessDeniedException("Voca nao tem permissao para atualizar este plano.");
    }

    trainingPlan.setPlanName(trainingPlanDTO.getPlanName());
    trainingPlan.setPlanDescription(trainingPlanDTO.getPlanDescription());
    trainingPlan.setDuration(trainingPlanDTO.getDuration());

    List<Exercise> updatedExercises = new ArrayList<>();

    if (trainingPlanDTO.getExerciseIds() != null && !trainingPlanDTO.getExerciseIds().isEmpty()) {
      for (Long exerciseId : trainingPlanDTO.getExerciseIds()) {
        Exercise existingExercise = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new ResourceNotFoundException("Exercicio nao encontrado"));
        existingExercise.setTrainingPlans(trainingPlan);
        updatedExercises.add(existingExercise);
      }
    }

    if (trainingPlanDTO.getNewExercises() != null && !trainingPlanDTO.getNewExercises().isEmpty()) {
      for (ExerciseDTO newExerciseDTO : trainingPlanDTO.getNewExercises()) {
        Exercise newExercise = new Exercise();
        newExercise.setExerciseName(newExerciseDTO.getExerciseName());
        newExercise.setExerciseDescription(newExerciseDTO.getExerciseDescription());
        newExercise.setSeriesQuantity(newExerciseDTO.getSeriesQuantity());
        newExercise.setRepetitionsQuantity(newExerciseDTO.getRepetitionsQuantity());
        newExercise.setWeightUsed(newExerciseDTO.getWeightUsed());
        newExercise.setRestTime(newExerciseDTO.getRestTime());
        newExercise.setTrainingPlans(trainingPlan);

        updatedExercises.add(newExercise);
      }
    }

    trainingPlan.setExerciseList(updatedExercises);
    exerciseRepository.saveAll(updatedExercises);
    trainingPlansRepository.save(trainingPlan);

    return new TrainingPlansDTO(trainingPlan, true);
  }

  public void deletarPlano(Long trainingPlanId) {
    User loggedUser = utils.getLoggedUser();
    TrainingPlans plan = trainingPlansRepository.findById(trainingPlanId)
        .orElseThrow(() -> new EntityNotFoundException("Plano de treino nao encontrado"));

    if (!plan.getUser().getId().equals(loggedUser.getId())) {
      throw new AccessDeniedException("Voce nao tem permissao para excluir este plano.");
    }

    User user = plan.getUser();
    user.getTrainingPlans().remove(plan);

    trainingPlansRepository.delete(plan);
  }

  public ExerciseDTO addExerciseToTrainingPlan(Long trainingPlanId, ExerciseDTO exerciseDTO) {
    TrainingPlans trainingPlan = trainingPlansRepository.findById(trainingPlanId)
        .orElseThrow(() -> new ResourceNotFoundException("Plano de treino nao encontrado"));

    Exercise newExercise = new Exercise();
    newExercise.setExerciseName(exerciseDTO.getExerciseName());
    newExercise.setExerciseDescription(exerciseDTO.getExerciseDescription());
    newExercise.setSeriesQuantity(exerciseDTO.getSeriesQuantity());
    newExercise.setRepetitionsQuantity(exerciseDTO.getRepetitionsQuantity());
    newExercise.setWeightUsed(exerciseDTO.getWeightUsed());
    newExercise.setRestTime(exerciseDTO.getRestTime());

    newExercise.setTrainingPlans(trainingPlan);

    exerciseRepository.save(newExercise);

    trainingPlan.getExerciseList().add(newExercise);
    trainingPlansRepository.save(trainingPlan);

    return new ExerciseDTO(newExercise);
  }

  public List<TrainingPlansDTO> getAllTrainingPlans() {
    var loggedUser = utils.getLoggedUser();
    return loggedUser.getTrainingPlans().stream()
        .map(plan -> new TrainingPlansDTO(plan, false))
        .collect(Collectors.toList());
  }

  public TrainingPlansDTO getTrainingPlanById(Long id) {
    User loggedUser = utils.getLoggedUser();

    TrainingPlans trainingPlan = trainingPlansRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Plano de treino nao encontrado"));

    boolean isOwner = trainingPlan.getUser().getId().equals(loggedUser.getId());

    if (!isOwner) {
      throw new AccessDeniedException("Voce nao tem permissao para acessar este plano.");
    }

    List<ExerciseDTO> exercises = exerciseService.getExercisesByIds(trainingPlan.getExerciseIds());

    TrainingPlansDTO trainingPlanDTO = new TrainingPlansDTO(trainingPlan);
    trainingPlanDTO.setNewExercises(exercises);

    return trainingPlanDTO;
  }
}
