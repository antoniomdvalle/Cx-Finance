package com.cx_finance.cx_finance.service;

import com.cx_finance.cx_finance.dto.GoalRequestDTO;
import com.cx_finance.cx_finance.dto.GoalResponseDTO;
import com.cx_finance.cx_finance.model.Goal;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.repository.GoalRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @Transactional(readOnly = true)
    public List<GoalResponseDTO> listarMetas(User user) {
        return goalRepository
                .findByUser_IdOrderByPrazoAsc(user.getId())
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public GoalResponseDTO criarMeta(GoalRequestDTO dto, User user) {
        Goal goal = new Goal();

        preencherMeta(goal, dto);
        goal.setUser(user);

        return converterParaDTO(goalRepository.save(goal));
    }

    @Transactional
    public GoalResponseDTO atualizarMeta(
            Long id,
            GoalRequestDTO dto,
            User user) {

        Goal goal = buscarMetaDoUsuario(id, user);

        preencherMeta(goal, dto);

        return converterParaDTO(goalRepository.save(goal));
    }

    @Transactional
    public void excluirMeta(Long id, User user) {
        Goal goal = buscarMetaDoUsuario(id, user);
        goalRepository.delete(goal);
    }

    private Goal buscarMetaDoUsuario(Long id, User user) {
        return goalRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Meta não encontrada."
                ));
    }

    private void preencherMeta(Goal goal, GoalRequestDTO dto) {
        goal.setNomeMeta(dto.nomeMeta().trim());
        goal.setValorObjetivo(dto.valorObjetivo());
        goal.setValorGuardado(dto.valorGuardado());
        goal.setPrazo(dto.prazo());
        goal.setDescricao(dto.descricao());
    }

    private GoalResponseDTO converterParaDTO(Goal goal) {
        BigDecimal percentual = goal.getValorGuardado()
                .multiply(BigDecimal.valueOf(100))
                .divide(goal.getValorObjetivo(), 0, RoundingMode.HALF_UP);

        int progresso = percentual
                .min(BigDecimal.valueOf(100))
                .intValue();

        return new GoalResponseDTO(
                goal.getId(),
                goal.getNomeMeta(),
                goal.getValorObjetivo(),
                goal.getValorGuardado(),
                goal.getPrazo(),
                goal.getDescricao(),
                progresso
        );
    }
    @Transactional(readOnly = true)
    public GoalResponseDTO obterMeta(Long id, User user) {
        Goal goal = buscarMetaDoUsuario(id, user);
        return converterParaDTO(goal);
    }
}