package com.cx_finance.cx_finance.controller;

import com.cx_finance.cx_finance.dto.GoalRequestDTO;
import com.cx_finance.cx_finance.dto.GoalResponseDTO;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.service.GoalService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalService goalService;

    public GoalController(GoalService goalService){
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<?> listarMetas(HttpServletRequest request) {
        User user = obterUsuarioAutenticado(request);

        if (user == null) {
            return naoAutorizado();
        }

        List<GoalResponseDTO> metas = goalService.listarMetas(user);

        return ResponseEntity.ok(metas);
    }

    @PostMapping
    public ResponseEntity<?> criarMeta(
            @Valid @RequestBody GoalRequestDTO dto,
            HttpServletRequest request) {

        User user = obterUsuarioAutenticado(request);

        if (user == null) {
            return naoAutorizado();
        }

        GoalResponseDTO meta = goalService.criarMeta(dto, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(meta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarMeta(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequestDTO dto,
            HttpServletRequest request) {

        User user = obterUsuarioAutenticado(request);

        if (user == null) {
            return naoAutorizado();
        }

        GoalResponseDTO meta = goalService.atualizarMeta(id, dto, user);

        return ResponseEntity.ok(meta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirMeta(
            @PathVariable Long id,
            HttpServletRequest request) {

        User user = obterUsuarioAutenticado(request);

        if (user == null) {
            return naoAutorizado();
        }

        goalService.excluirMeta(id, user);

        return ResponseEntity.noContent().build();
    }

    private User obterUsuarioAutenticado(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return null;
        }

        Object loggedUser = session.getAttribute("loggedUser");

        if (loggedUser instanceof User user) {
            return user;
        }

        return null;
    }

    private ResponseEntity<Map<String, String>> naoAutorizado() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "erro",
                        "Sessão inválida ou usuário não autenticado."
                ));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> obterMeta(
            @PathVariable Long id,
            HttpServletRequest request) {

        User user = obterUsuarioAutenticado(request);

        if (user == null) {
            return naoAutorizado();
        }

        GoalResponseDTO meta = goalService.obterMeta(id, user);

        return ResponseEntity.ok(meta);
    }
}
