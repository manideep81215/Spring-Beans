package com.hackathon.hcl.service;

import com.hackathon.hcl.DTO.OrderItemResponseDTO;
import com.hackathon.hcl.DTO.OrderResponseDTO;
import com.hackathon.hcl.DTO.OrderStatusUpdateRequestDTO;
import com.hackathon.hcl.DTO.PlaceOrderRequestDTO;
import com.hackathon.hcl.exception.BadRequestException;
import com.hackathon.hcl.exception.ResourceNotFoundException;
import com.hackathon.hcl.model.Cart;
import com.hackathon.hcl.model.CartItem;
import com.hackathon.hcl.model.Order;
import com.hackathon.hcl.model.OrderItem;
import com.hackathon.hcl.model.User;
import com.hackathon.hcl.repository.CartRepository;
import com.hackathon.hcl.repository.OrderRepository;
import com.hackathon.hcl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailNotificationService emailNotificationService;
    private static final Set<String> ALLOWED_ORDER_STATUSES = Set.of(
            "PLACED",
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED");

    @Transactional
    public OrderResponseDTO placeOrderFromCart(String authorizationHeader, PlaceOrderRequestDTO request) {
        User user = getUserFromToken(authorizationHeader);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot place order from an empty cart");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PLACED");
        order.setTotalAmount(cart.getTotalAmount());
        order.setAddress(request.getAddress());

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            order.getOrderItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        cart.getCartItems().clear();
        cart.setTotalAmount(java.math.BigDecimal.ZERO);
        cartRepository.save(cart);
        emailNotificationService.sendOrderConfirmation(savedOrder);
        return toOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrderHistory(String authorizationHeader) {
        User user = getUserFromToken(authorizationHeader);
        if (isRestaurantStaff(user)) {
            return orderRepository.findAllByOrderByPlacedAtDesc().stream()
                    .map(this::toOrderResponse)
                    .toList();
        }
        return orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId()).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(String authorizationHeader, Integer id) {
        User user = getUserFromToken(authorizationHeader);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!isRestaurantStaff(user) && !order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        return toOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public String getOrderStatus(String authorizationHeader, Integer id) {
        return getOwnedOrder(authorizationHeader, id).getStatus();
    }

    @Transactional
    public OrderResponseDTO cancelOrder(String authorizationHeader, Integer id) {
        Order order = getOwnedOrder(authorizationHeader, id);
        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new BadRequestException("Order is already cancelled");
        }
        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new BadRequestException("Delivered order cannot be cancelled");
        }
        order.setStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);
        emailNotificationService.sendOrderCancellation(savedOrder);
        return toOrderResponse(savedOrder);
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Integer orderId, OrderStatusUpdateRequestDTO request) {
        String status = request.getStatus().toUpperCase();
        if (!ALLOWED_ORDER_STATUSES.contains(status)) {
            throw new BadRequestException("Invalid order status");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        return toOrderResponse(orderRepository.save(order));
    }

    private User getUserFromToken(String authorizationHeader) {
        Integer userId = jwtService.extractUserId(authorizationHeader);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Order getOwnedOrder(String authorizationHeader, Integer orderId) {
        User user = getUserFromToken(authorizationHeader);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        return order;
    }

    private boolean isRestaurantStaff(User user) {
        return "ADMIN".equalsIgnoreCase(user.getRole()) || "RESTAURANT".equalsIgnoreCase(user.getRole());
    }

    private OrderResponseDTO toOrderResponse(Order order) {
        List<OrderItemResponseDTO> items = order.getOrderItems().stream()
                .map(this::toOrderItemResponse)
                .toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getFirstName() + " " + order.getUser().getLastName(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getAddress(),
                order.getPlacedAt(),
                order.getUpdatedAt(),
                items);
    }

    private OrderItemResponseDTO toOrderItemResponse(OrderItem item) {
        return new OrderItemResponseDTO(
                item.getId(),
                item.getOrder().getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getPrice());
    }
}
