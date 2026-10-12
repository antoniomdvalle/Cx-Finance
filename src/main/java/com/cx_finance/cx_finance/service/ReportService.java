package com.cx_finance.cx_finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cx_finance.cx_finance.dto.ReportMovimentacaoDTO;
import com.cx_finance.cx_finance.dto.ReportResponseDTO;
import com.cx_finance.cx_finance.model.RegistroFinanceiro;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.repository.RegistroFinanceiroRepository;

@Service
public class ReportService {

    private final RegistroFinanceiroRepository repository;

    public ReportService(RegistroFinanceiroRepository repository) {
        this.repository = repository;
    }

    public ReportResponseDTO gerarRelatorio(
            User user,
            LocalDate dataInicio,
            LocalDate dataFim,
            String categoria) {

        List<RegistroFinanceiro> todos =
            repository.findAllByUser_IdOrderByDataDescIdDesc(
                user.getId()
            );

        List<String> categorias = todos.stream()
            .map(RegistroFinanceiro::getCategoria)
            .filter(c -> c != null && !c.isBlank())
            .distinct()
            .sorted(String.CASE_INSENSITIVE_ORDER)
            .toList();

        List<RegistroFinanceiro> filtrados = todos.stream()
            .filter(r -> dataInicio == null
                || !r.getData().isBefore(dataInicio))
            .filter(r -> dataFim == null
                || !r.getData().isAfter(dataFim))
            .filter(r -> categoria == null
                || categoria.isBlank()
                || r.getCategoria().equalsIgnoreCase(categoria))
            .toList();

        BigDecimal receitas = BigDecimal.ZERO;
        BigDecimal despesas = BigDecimal.ZERO;

        Map<String, BigDecimal> despesasPorCategoria =
            new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

        for (RegistroFinanceiro registro : filtrados) {

            String tipo = registro.getTipo()
                .trim()
                .toUpperCase(Locale.ROOT);

            if (tipo.equals("ENTRADA")) {
                receitas = receitas.add(registro.getValor());

            } else if (tipo.equals("SAIDA")) {
                despesas = despesas.add(registro.getValor());

                despesasPorCategoria.merge(
                    registro.getCategoria(),
                    registro.getValor(),
                    BigDecimal::add
                );
            }
        }

        List<ReportMovimentacaoDTO> movimentacoes =
            filtrados.stream()
                .map(r -> new ReportMovimentacaoDTO(
                    r.getId(),
                    r.getData(),
                    r.getDescricao(),
                    r.getCategoria(),
                    r.getTipo(),
                    r.getValor()
                ))
                .toList();

        return new ReportResponseDTO(
            receitas,
            despesas,
            receitas.subtract(despesas),
            movimentacoes.size(),
            dataInicio,
            dataFim,
            movimentacoes,
            despesasPorCategoria,
            categorias
        );
    }
}