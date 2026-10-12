package com.cx_finance.cx_finance.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cx_finance.cx_finance.dto.DashboardResponseDTO;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.service.DashboardService;

import com.cx_finance.cx_finance.dto.DashboardMensalDTO;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardApiController {

    private final DashboardService dashboardService;

    public DashboardApiController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> obterResumo(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", "Sessão não autenticada."));
        }

        Object usuarioSessao = session.getAttribute("loggedUser");

        if (!(usuarioSessao instanceof User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", "Sessão inválida ou usuário não autenticado."));
        }

        DashboardResponseDTO resumo = dashboardService.obterResumo(user);

        return ResponseEntity.ok(resumo);
    }
    @GetMapping("/evolucao-mensal")
    public ResponseEntity<?> obterEvolucaoMensal(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Sessão não autenticada."));
        }

        Object usuarioSessao = session.getAttribute("loggedUser");

        if (!(usuarioSessao instanceof User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "erro",
                    "Sessão inválida ou usuário não autenticado."
                ));
        }

        List<DashboardMensalDTO> dados =
            dashboardService.obterEvolucaoMensal(user);

        return ResponseEntity.ok(dados);
    }
}