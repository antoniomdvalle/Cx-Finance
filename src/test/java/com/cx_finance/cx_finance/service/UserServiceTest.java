package com.cx_finance.cx_finance.service;

import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAuthenticateSuccess() {
        // cenário simulado (Mock)
        User mockUser = new User();
        mockUser.setEmail("antonio@email.com");
        mockUser.setPassword("hashed_secret");

        when(userRepository.findByEmail("antonio@email.com")).thenReturn(Optional.of(mockUser));
        
        when(passwordEncoder.matches("123456", "hashed_secret")).thenReturn(true);
        Optional<User> result = userService.authenticate("antonio@email.com", "123456");

        assertTrue(result.isPresent(), "O usuário deveria ser autenticado com sucesso");
        assertEquals("antonio@email.com", result.get().getEmail());
    }
}