package com.expense.tracker.service;

import com.expense.tracker.User;
import com.expense.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔐 REGISTER
    public User register(User user) {

        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists ❌");
        }

        // 🔥 HASH PASSWORD
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // 🔐 LOGIN
    public User login(String username, String password) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found ❌");
        }

        // 🔥 MATCH HASH PASSWORD
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Wrong password ❌");
        }

        return user;
    }

    // 🔐 CHANGE PASSWORD
    public void changePassword(
            String username,
            String oldPassword,
            String newPassword
    ) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found ❌");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect ❌");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }


    public void forgotPassword(String username, String newPassword) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found ❌");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }
}