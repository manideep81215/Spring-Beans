package com.hackathon.hcl.service;

import com.hackathon.hcl.model.Order;
import com.hackathon.hcl.model.OrderItem;
import com.hackathon.hcl.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@foodrush.local}")
    private String fromAddress;

    @Async
    public void sendRegistrationConfirmation(User user) {
        send(
                user.getEmail(),
                "Welcome to FoodRush",
                """
                        Hi %s,

                        Your FoodRush account has been created successfully.

                        You can now browse restaurants, add items to your cart, and track your orders.

                        Thanks,
                        FoodRush
                        """.formatted(fullName(user)));
    }

    public void sendOrderConfirmation(Order order) {
        send(
                order.getUser().getEmail(),
                "FoodRush order confirmation #" + order.getId(),
                """
                        Hi %s,

                        Your order #%d has been placed successfully.

                        Delivery address:
                        %s

                        Items:
                        %s

                        Total: Rs %s

                        Thanks,
                        FoodRush
                        """.formatted(
                        fullName(order.getUser()),
                        order.getId(),
                        order.getAddress(),
                        orderItems(order),
                        order.getTotalAmount()));
    }

    public void sendOrderCancellation(Order order) {
        send(
                order.getUser().getEmail(),
                "FoodRush order cancelled #" + order.getId(),
                """
                        Hi %s,

                        Your order #%d has been cancelled.

                        If this was a mistake, you can place a new order anytime.

                        Thanks,
                        FoodRush
                        """.formatted(fullName(order.getUser()), order.getId()));
    }

    private void send(String to, String subject, String body) {
        if (to == null || to.isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email notification sent to {} with subject '{}'", to, subject);
        } catch (MailException ex) {
            log.warn("Email notification could not be sent to {}: {}", to, ex.getMessage());
        }
    }

    private String fullName(User user) {
        return (user.getFirstName() + " " + user.getLastName()).trim();
    }

    private String orderItems(Order order) {
        return order.getOrderItems().stream()
                .map(this::orderItemLine)
                .collect(Collectors.joining("\n"));
    }

    private String orderItemLine(OrderItem item) {
        return "- %s x%d - Rs %s".formatted(
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
    }
}
