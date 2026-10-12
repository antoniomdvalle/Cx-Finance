package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record ReportResponseDTO(
    BigDecimal totalReceitas,
    BigDecimal totalDespesas,
    BigDecimal saldo,
    int quantidadeMovimentacoes,
    LocalDate dataInicio,
    LocalDate dataFim,
    List<ReportMovimentacaoDTO> movimentacoes,
    Map<String, BigDecimal> despesasPorCategoria,
    List<String> categorias
) {}