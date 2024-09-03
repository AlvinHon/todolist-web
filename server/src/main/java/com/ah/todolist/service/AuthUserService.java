package com.ah.todolist.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ah.todolist.model.AuthUserDetails;
import com.ah.todolist.model.User;
import com.ah.todolist.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthUserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new AuthUserDetails(user);
    }

    public UUID register(String username, String password) throws IllegalArgumentException {
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("User already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        try {
            return userRepository.save(user).getId();
        } catch (Exception e) {
            throw new IllegalArgumentException("Database error");
        }
    }

    public Optional<String> currentAuthenticatedClientName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return Optional.of(authentication.getName());
        }
        return Optional.empty();
    }

}
