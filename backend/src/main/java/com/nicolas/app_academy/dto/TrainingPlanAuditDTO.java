package com.nicolas.app_academy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrainingPlanAuditDTO {
  private Long id;
  private String planName;
  private String planDescription;
  private Integer duration;
  private String modifiedBy;
  private String revisionType;
  private String modifiedAt; 
}
