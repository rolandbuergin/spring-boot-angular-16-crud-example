package com.bezkoder.spring.jpa.h2.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "tutorials")
public class Tutorial {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @NotBlank(message = "Titel darf nicht leer sein.")
  @Pattern(regexp = "^(?!\\s)(?!.*\\s$).+", message = "Titel darf nicht mit Leerzeichen beginnen oder enden.")
  @Column(name = "title")
  private String title;

  @NotBlank(message = "Beschreibung darf nicht leer sein.")
  @Pattern(regexp = "^(?!\\s)(?!.*\\s$).+", message = "Beschreibung darf nicht mit Leerzeichen beginnen oder enden.")
  @Column(name = "description")
  private String description;

  @NotNull(message = "Einwohner ist erforderlich.")
  @Min(value = 0, message = "Einwohner darf nicht negativ sein.")
  @Digits(integer = 10, fraction = 0, message = "Einwohner muss eine ganze Zahl sein.")
  @Column(name = "einwohner")
  private Integer einwohner;

  @Column(name = "published")
  private boolean published;

  public Tutorial() {

  }

  public Tutorial(String title, String description, Integer einwohner, boolean published) {
    this.title = title;
    this.description = description;
    this.einwohner = einwohner;
    this.published = published;
  }

  public long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Integer getEinwohner() {
    return einwohner;
  }

  public void setEinwohner(Integer einwohner) {
    this.einwohner = einwohner;
  }

  public boolean isPublished() {
    return published;
  }

  public void setPublished(boolean isPublished) {
    this.published = isPublished;
  }

  @PrePersist
  @PreUpdate
  private void trimFields() {
    if (title != null) {
      title = title.trim();
    }
    if (description != null) {
      description = description.trim();
    }
  }

  @Override
  public String toString() {
    return "Tutorial [id=" + id + ", title=" + title + ", desc=" + description + ", einwohner=" + einwohner
        + ", published=" + published + "]";
  }

}
