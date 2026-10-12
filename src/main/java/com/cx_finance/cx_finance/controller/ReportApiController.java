package com.cx_finance.cx_finance.controller;

import java.time.LocalDate;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportApiController {

    private final ReportService reportService;

    public ReportApiController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<?> gerarRelatorio(
            HttpServletRequest request,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFim,
            @RequestParam(required = false) String categoria) {

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

        if (dataInicio != null && dataFim != null
                && dataInicio.isAfter(dataFim)) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "erro",
                    "A data inicial não pode ser posterior à data final."
                ));
        }

        return ResponseEntity.ok(
            reportService.gerarRelatorio(
                user, dataInicio, dataFim, categoria
            )
        );
    }
}