package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;

public record DashboardResponseDTO(
    BigDecimal totalReceitas,
    BigDecimal totalDespesas,
    BigDecimal saldoAtual
) {}