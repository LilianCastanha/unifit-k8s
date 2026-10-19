package com.nicolas.app_academy.dto;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

import com.nicolas.app_academy.entities.TrainingPlans;
import com.nicolas.app_academy.entities.User;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO implements Serializable {
  private Long id;
  private String name;
  private String email;

  @ElementCollection(fetch = FetchType.EAGER)
  private List<String> roles;

  private Integer age;
  private Float height;
  private float weight;
  private List<Long> trainingPlansIds;
  private String userIdentifier;

  public UserDTO(User user) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmail();
    this.roles = user.getRoles();
    this.age = user.getAge();
    this.userIdentifier = user.getUserIdentifier();
    this.weight = user.getWeight();
    this.height = user.getHeight();
    this.trainingPlansIds = user.getTrainingPlans() != null
        ? user.getTrainingPlans().stream().map(TrainingPlans::getId).collect(Collectors.toList())
        : null;
  }
}
