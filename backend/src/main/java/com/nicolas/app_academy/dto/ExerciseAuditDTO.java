package com.nicolas.app_academy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExerciseAuditDTO {
  private Long id;
  private String exerciseName;
  private String exerciseDescription;
  private Integer seriesQuantity;
  private Integer repetitionsQuantity;
  private Integer weightUsed;
  private Integer restTime;
  private String modifiedBy;
  private String revisionType;
  private String modifiedAt; 
}
