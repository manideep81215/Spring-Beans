package com.hackathon.hcl.repository;

import com.hackathon.hcl.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByCartIdAndMenuItemId(Integer cartId, Integer menuItemId);

    List<CartItem> findByCartId(Integer cartId);
}
