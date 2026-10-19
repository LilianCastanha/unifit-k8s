package com.nicolas.app_academy.entities;

import jakarta.persistence.*;
import org.hibernate.envers.DefaultRevisionEntity;
import org.hibernate.envers.RevisionEntity;

import com.nicolas.app_academy.utils.CustomRevisionListener;

import java.util.Date;

@Entity
@RevisionEntity(CustomRevisionListener.class)
@Table(name = "custom_revision_entity")
public class CustomRevisionEntity extends DefaultRevisionEntity {

  private static final long serialVersionUID = 1L;

  @Column(name = "username")
  private String username;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Date getTimestampAsDate() {
    return new Date(super.getTimestamp());
  }
}
