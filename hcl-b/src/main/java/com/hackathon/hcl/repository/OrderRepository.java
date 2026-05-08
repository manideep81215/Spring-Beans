package com.hackathon.hcl.repository;

import com.hackathon.hcl.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserIdOrderByPlacedAtDesc(Integer userId);

    List<Order> findAllByOrderByPlacedAtDesc();
}
