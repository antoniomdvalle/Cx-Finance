package com.cx_finance.cx_finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroFinanceiroResponse {

    private Long id;
    private String descricao;
    private String categoria;
    private String tipo;
    private BigDecimal valor;
    private LocalDate data;
}