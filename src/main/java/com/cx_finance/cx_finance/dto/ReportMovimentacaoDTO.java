package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReportMovimentacaoDTO(
    Long id,
    LocalDate data,
    String descricao,
    String categoria,
    String tipo,
    BigDecimal valor
) {}