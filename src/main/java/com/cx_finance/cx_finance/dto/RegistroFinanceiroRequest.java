package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class RegistroFinanceiroRequest {
    private String descricao;
    private String categoria;
    private String tipo;
    private BigDecimal valor;
    private LocalDate data;
}
