package com.nicolas.app_academy.services;

import com.nicolas.app_academy.dto.AuditAllHistoryDTO;
import com.nicolas.app_academy.dto.ExerciseAuditDTO;
import com.nicolas.app_academy.dto.TrainingPlanAuditDTO;
import com.nicolas.app_academy.entities.CustomRevisionEntity;
import com.nicolas.app_academy.entities.Exercise;
import com.nicolas.app_academy.entities.TrainingPlans;
import jakarta.persistence.EntityManager;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuditionService {

  @Autowired
  private EntityManager entityManager;

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_INSTANT;

  public List<TrainingPlanAuditDTO> getTrainingPlanAuditHistory(Long trainingPlanId) {
    AuditReader reader = AuditReaderFactory.get(entityManager);

    List<Object[]> revisions = reader.createQuery()
        .forRevisionsOfEntity(TrainingPlans.class, false, true)
        .add(AuditEntity.id().eq(trainingPlanId))
        .getResultList();

    List<TrainingPlanAuditDTO> dtoList = new ArrayList<>();

    for (Object[] revObj : revisions) {
      TrainingPlans plan = (TrainingPlans) revObj[0];
      CustomRevisionEntity revEntity = (CustomRevisionEntity) revObj[1];
      RevisionType revType = (RevisionType) revObj[2];

      String formattedDate = FORMATTER.format(Instant.ofEpochMilli(revEntity.getTimestamp()));

      dtoList.add(new TrainingPlanAuditDTO(
          plan.getId(),
          plan.getPlanName(),
          plan.getPlanDescription(),
          plan.getDuration(),
          revEntity.getUsername(),
          getRevisionTypeDescription(revType),
          formattedDate));
    }

    return dtoList;
  }

  public List<ExerciseAuditDTO> getExerciseAuditHistory(Long exerciseId) {
    AuditReader reader = AuditReaderFactory.get(entityManager);

    List<Object[]> revisions = reader.createQuery()
        .forRevisionsOfEntity(Exercise.class, false, true)
        .add(AuditEntity.id().eq(exerciseId))
        .getResultList();

    List<ExerciseAuditDTO> dtoList = new ArrayList<>();

    for (Object[] rev : revisions) {
      Exercise ex = (Exercise) rev[0];
      CustomRevisionEntity revEntity = (CustomRevisionEntity) rev[1];
      RevisionType type = (RevisionType) rev[2];

      String date = FORMATTER.format(Instant.ofEpochMilli(revEntity.getTimestamp()));

      dtoList.add(new ExerciseAuditDTO(
          ex.getId(),
          ex.getExerciseName(),
          ex.getExerciseDescription(),
          ex.getSeriesQuantity(),
          ex.getRepetitionsQuantity(),
          ex.getWeightUsed(),
          ex.getRestTime(),
          revEntity.getUsername(),
          getRevisionTypeDescription(type),
          date));
    }

    return dtoList;
  }

  public List<AuditAllHistoryDTO> getAllAuditHistory() {
    AuditReader reader = AuditReaderFactory.get(entityManager);

    List<AuditAllHistoryDTO> history = new ArrayList<>();

    List<Object[]> planRevisions = reader.createQuery()
        .forRevisionsOfEntity(TrainingPlans.class, false, true)
        .getResultList();

    for (Object[] rev : planRevisions) {
      TrainingPlans plan = (TrainingPlans) rev[0];
      CustomRevisionEntity revEntity = (CustomRevisionEntity) rev[1];
      RevisionType revType = (RevisionType) rev[2];

      history.add(new AuditAllHistoryDTO(
          plan.getId(),
          "Plano de Treino",
          plan.getPlanName(),
          revEntity.getUsername(),
          getRevisionTypeDescription(revType),
          FORMATTER.format(Instant.ofEpochMilli(revEntity.getTimestamp()))));
    }

    List<Object[]> exerciseRevisions = reader.createQuery()
        .forRevisionsOfEntity(Exercise.class, false, true)
        .getResultList();

    for (Object[] rev : exerciseRevisions) {
      Exercise ex = (Exercise) rev[0];
      CustomRevisionEntity revEntity = (CustomRevisionEntity) rev[1];
      RevisionType revType = (RevisionType) rev[2];

      history.add(new AuditAllHistoryDTO(
          ex.getId(),
          "Exercício",
          ex.getExerciseName(),
          revEntity.getUsername(),
          getRevisionTypeDescription(revType),
          FORMATTER.format(Instant.ofEpochMilli(revEntity.getTimestamp()))));
    }

    history.sort((h1, h2) -> h2.getDate().compareTo(h1.getDate()));

    return history;
  }

  private String getRevisionTypeDescription(RevisionType type) {
    return switch (type) {
      case ADD -> "Criado";
      case MOD -> "Atualizado";
      case DEL -> "Deletado";
    };
  }
}
