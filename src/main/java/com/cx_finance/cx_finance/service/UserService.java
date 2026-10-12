package com.cx_finance.cx_finance.service;

import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service 
public class UserService {
    @Autowired 
    private UserRepository userRepository;

    public boolean registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return false; // Email já cadastrado
        }
        // Aqui você poderá criptografar a senha no futuro antes de salvar
        userRepository.save(user);
        return true;
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userFound = userRepository.findByEmail(email);
        if (userFound.isPresent() && userFound.get().getPassword().equals(password)) {
            return userFound;
        }
        return Optional.empty();
    }
}
