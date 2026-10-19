package com.nicolas.app_academy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nicolas.app_academy.entities.TrainingPlans;

@Repository
public interface TrainingPlansRepository extends JpaRepository<TrainingPlans, Long> {

}
