package com.cx_finance.cx_finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalRequestDTO(

        @NotBlank(message = "O nome da meta é obrigatório.")
        @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres.")
        String nomeMeta,

        @NotNull(message = "O valor objetivo é obrigatório.")
        @DecimalMin(value = "0.01", message = "O valor objetivo deve ser maior que zero.")
        BigDecimal valorObjetivo,

        @NotNull(message = "O valor guardado é obrigatório.")
        @DecimalMin(value = "0.00", message = "O valor guardado não pode ser negativo.")
        BigDecimal valorGuardado,

        @NotNull(message = "O prazo é obrigatório.")
        LocalDate prazo,

        @Size(max = 2000, message = "A descrição deve ter no máximo 2000 caracteres.")
        String descricao

) {}