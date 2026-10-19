package com.nicolas.app_academy.entities;

import org.hibernate.envers.Audited;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Audited
@Getter
@Setter
@Entity
@Table(name = "tb_exercise")
public class Exercise {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String exerciseName;
  private String exerciseDescription;
  private Integer seriesQuantity;
  private Integer repetitionsQuantity;
  private Integer weightUsed;
  private Integer restTime;

  @ManyToOne
  @JoinColumn(name = "training_plans_id")
  private TrainingPlans trainingPlans;
}
