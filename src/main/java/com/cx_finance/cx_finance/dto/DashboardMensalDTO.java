package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;

public record DashboardMensalDTO(
    String mes,
    BigDecimal totalReceitas,
    BigDecimal totalDespesas
) {}