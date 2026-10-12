package com.cx_finance.cx_finance.controller;

import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cx_finance.cx_finance.dto.RegistroFinanceiroRequest;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.service.RegistroFinanceiroService;

@RestController
@RequestMapping("/api/registros-financeiros")
public class RegistroFinanceiroController {
    private final RegistroFinanceiroService registroService;

    public RegistroFinanceiroController(RegistroFinanceiroService registroService){
        this.registroService = registroService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criarRegistro(
            @RequestBody RegistroFinanceiroRequest requisicao,
            HttpServletRequest request) {

        // Não cria uma nova sessão se não houver uma ativa.
        HttpSession session = request.getSession(false);

        Object usuarioSessao = (session == null)
                ? null
                : session.getAttribute("loggedUser");

        // Protege a API mesmo sem adicionar esse endpoint ao interceptor.
        if (!(usuarioSessao instanceof User usuario)
                || usuario.getId() == null) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "erro",
                            "Sua sessão expirou. Faça login novamente."
                    ));
        }

        try {
            Long id = registroService.criarRegistro(
                    requisicao,
                    usuario.getId()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "mensagem",
                            "Registro financeiro criado com sucesso!",
                            "id",
                            id
                    ));

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", e.getMessage()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }
        @GetMapping
        public ResponseEntity<?> listarRegistros(
                HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        Object usuarioSessao = (session == null)
                ? null
                : session.getAttribute("loggedUser");

        if (!(usuarioSessao instanceof User usuario)
                || usuario.getId() == null) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "erro",
                                "Sua sessão expirou. Faça login novamente."
                        ));
        }

        var registros = registroService.listarRegistrosDoUsuario(
                usuario.getId()
        );

        return ResponseEntity.ok(registros);
        }
}
