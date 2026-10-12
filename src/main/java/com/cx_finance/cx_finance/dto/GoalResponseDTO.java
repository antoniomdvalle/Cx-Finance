package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalResponseDTO(
        Long id,
        String nomeMeta,
        BigDecimal valorObjetivo,
        BigDecimal valorGuardado,
        LocalDate prazo,
        String descricao,
        int progresso
) {}