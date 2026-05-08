package com.hackathon.hcl.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Restaurant name is required")
    @Size(max = 100, message = "Restaurant name must be at most 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Cuisine is required")
    @Size(max = 60, message = "Cuisine must be at most 60 characters")
    @Column(nullable = false, length = 60)
    private String cuisine;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must be at most 255 characters")
    @Column(nullable = false)
    private String address;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating cannot be less than 0")
    @DecimalMax(value = "5.0", message = "Rating cannot be greater than 5")
    @Column(nullable = false)
    private Double rating;

    @NotNull(message = "Open status is required")
    @Column(nullable = false)
    private Boolean open;
    

    @NotNull(message="dish type is mandatory")
    @Column(nullable=false)
    private String  dish;
    

    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Size(max = 100, message = "Image content type must be at most 100 characters")
    @Column(name = "image_content_type", length = 100)
    private String imageContentType;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<MenuItem> menuItems = new ArrayList<>();
}
