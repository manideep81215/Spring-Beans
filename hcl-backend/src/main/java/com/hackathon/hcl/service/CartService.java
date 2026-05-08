package com.hackathon.hcl.service;

import com.hackathon.hcl.DTO.CartItemRequestDTO;
import com.hackathon.hcl.DTO.CartItemResponseDTO;
import com.hackathon.hcl.DTO.CartResponseDTO;
import com.hackathon.hcl.DTO.QuantityUpdateRequestDTO;
import com.hackathon.hcl.exception.ResourceNotFoundException;
import com.hackathon.hcl.model.Cart;
import com.hackathon.hcl.model.CartItem;
import com.hackathon.hcl.model.MenuItem;
import com.hackathon.hcl.model.User;
import com.hackathon.hcl.repository.CartItemRepository;
import com.hackathon.hcl.repository.CartRepository;
import com.hackathon.hcl.repository.MenuItemRepository;
import com.hackathon.hcl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public CartResponseDTO getCurrentUserCart(String authorizationHeader) {
        User user = getUserFromToken(authorizationHeader);
        Cart cart = getOrCreateCart(user);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponseDTO addItemToCart(String authorizationHeader, CartItemRequestDTO request) {
        User user = getUserFromToken(authorizationHeader);
        Cart cart = getOrCreateCart(user);
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndMenuItemId(cart.getId(), menuItem.getId())
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setCart(cart);
                    item.setMenuItem(menuItem);
                    item.setQuantity(0);
                    cart.getCartItems().add(item);
                    return item;
                });

        cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        cartItem.setPrice(menuItem.getPrice());
        recalculateTotal(cart);
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO updateCartItemQuantity(
            String authorizationHeader,
            Integer itemId,
            QuantityUpdateRequestDTO request) {
        Cart cart = getOwnedCart(authorizationHeader);
        CartItem cartItem = findOwnedCartItem(cart, itemId);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setPrice(cartItem.getMenuItem().getPrice());
        recalculateTotal(cart);
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO removeItemFromCart(String authorizationHeader, Integer itemId) {
        Cart cart = getOwnedCart(authorizationHeader);
        CartItem cartItem = findOwnedCartItem(cart, itemId);
        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        recalculateTotal(cart);
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String authorizationHeader) {
        Cart cart = getOwnedCart(authorizationHeader);
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private User getUserFromToken(String authorizationHeader) {
        Integer userId = jwtService.extractUserId(authorizationHeader);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(cart);
                });
    }

    private Cart getOwnedCart(String authorizationHeader) {
        User user = getUserFromToken(authorizationHeader);
        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    private CartItem findOwnedCartItem(Cart cart, Integer itemId) {
        return cart.getCartItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cart.getCartItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }

    private CartResponseDTO toCartResponse(Cart cart) {
        List<CartItemResponseDTO> items = cart.getCartItems().stream()
                .map(this::toCartItemResponse)
                .toList();

        return new CartResponseDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getUser().getFirstName() + " " + cart.getUser().getLastName(),
                cart.getTotalAmount(),
                cart.getUpdatedAt(),
                items);
    }

    private CartItemResponseDTO toCartItemResponse(CartItem item) {
        return new CartItemResponseDTO(
                item.getId(),
                item.getCart().getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getPrice());
    }
}
