package com.hackathon.hcl.repository;

import com.hackathon.hcl.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    List<MenuItem> findByRestaurantId(Integer restaurantId);
}
