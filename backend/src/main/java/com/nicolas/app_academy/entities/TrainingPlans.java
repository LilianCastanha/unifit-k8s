package com.nicolas.app_academy.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Audited
@Getter
@Setter
@Entity
@Table(name = "tb_trainingPlans")
public class TrainingPlans {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String planName;
  private String planDescription;
  private Integer duration;

  @OneToMany(mappedBy = "trainingPlans", cascade = CascadeType.ALL)
  private List<Exercise> exerciseList = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
  private User user;

  public List<Long> getExerciseIds() {
    return exerciseList.stream().map(Exercise::getId).collect(Collectors.toList());
  }
}
