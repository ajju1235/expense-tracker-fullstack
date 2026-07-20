package com.expense.tracker.controller;

import com.expense.tracker.User;
import com.expense.tracker.dto.ChangePasswordRequest;
import com.expense.tracker.dto.ForgotPasswordRequest;
import com.expense.tracker.security.JwtUtil;
import com.expense.tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    // 🔐 REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {

        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        return userService.register(user);
    }

    // 🔐 LOGIN WITH JWT
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        if (user.getUsername() == null || user.getPassword() == null) {
            throw new RuntimeException("Username & Password required");
        }

        User loggedUser = userService.login(
                user.getUsername(),
                user.getPassword()
        );

        String token = JwtUtil.generateToken(loggedUser.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("user", loggedUser);
        response.put("token", token);

        return response;
    }

    // 🔐 CHANGE PASSWORD
    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {

        userService.changePassword(
                request.getUsername(),
                request.getOldPassword(),
                request.getNewPassword()
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully ✅");

        return response;
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(
                request.getUsername(),
                request.getNewPassword()
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully ✅");

        return response;
    }
}