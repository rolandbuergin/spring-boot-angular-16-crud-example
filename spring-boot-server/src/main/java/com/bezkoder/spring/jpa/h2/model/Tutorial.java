package com.bezkoder.spring.jpa.h2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tutorials")
public class Tutorial {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "title")
  private String title;

  @Column(name = "description")
  private String description;

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

  @Override
  public String toString() {
    return "Tutorial [id=" + id + ", title=" + title + ", desc=" + description + ", einwohner=" + einwohner
        + ", published=" + published + "]";
  }

}
