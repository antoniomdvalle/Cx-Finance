package com.cx_finance.cx_finance.controller;

import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession; // Importante para gerenciar a sessão

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        boolean success = userService.registerUser(user);
        
        if (!success) {
            return ResponseEntity.badRequest().body("Erro: E-mail já cadastrado.");
        }

        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user, HttpSession session) {
        Optional<User> authenticatedUser = userService.authenticate(user.getEmail(), user.getPassword());

        if (authenticatedUser.isPresent()) {
            session.setAttribute("loggedUser", authenticatedUser.get());
            return ResponseEntity.ok("Login realizado com sucesso!");
        }

        return ResponseEntity.status(401).body("Erro: E-mail ou senha inválidos.");
    }
}
