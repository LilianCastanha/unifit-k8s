package com.nicolas.app_academy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuditAllHistoryDTO {
  private Long itemId;
  private String itemType;
  private String itemName;
  private String user;
  private String action;
  private String date;
}