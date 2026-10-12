package com.cx_finance.cx_finance.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cx_finance.cx_finance.dto.DashboardResponseDTO;
import com.cx_finance.cx_finance.model.RegistroFinanceiro;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.repository.RegistroFinanceiroRepository;
import com.cx_finance.cx_finance.dto.DashboardMensalDTO;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DashboardService {

    private final RegistroFinanceiroRepository registroRepository;

    public DashboardService(
            RegistroFinanceiroRepository registroRepository) {
        this.registroRepository = registroRepository;
    }

    public DashboardResponseDTO obterResumo(User user) {

        List<RegistroFinanceiro> registros =
                registroRepository.findAllByUserId(user.getId());

        BigDecimal totalReceitas = BigDecimal.ZERO;
        BigDecimal totalDespesas = BigDecimal.ZERO;

        for (RegistroFinanceiro registro : registros) {

            String tipo = registro.getTipo().trim().toUpperCase();

            if (tipo.equals("ENTRADA")) {
                totalReceitas = totalReceitas.add(registro.getValor());
            } else if (tipo.equals("SAIDA")) {
                totalDespesas = totalDespesas.add(registro.getValor());
            }
        }

        BigDecimal saldoAtual = totalReceitas.subtract(totalDespesas);

        return new DashboardResponseDTO(
                totalReceitas,
                totalDespesas,
                saldoAtual
        );
    }
    public List<DashboardMensalDTO> obterEvolucaoMensal(User user) {

        YearMonth mesAtual = YearMonth.now();
        YearMonth primeiroMes = mesAtual.minusMonths(5);

        LocalDate dataInicio = primeiroMes.atDay(1);

        Map<YearMonth, BigDecimal[]> totais = new LinkedHashMap<>();

        // Inicializa os últimos seis meses, inclusive os sem lançamentos.
        for (int i = 0; i < 6; i++) {
            YearMonth mes = primeiroMes.plusMonths(i);

            totais.put(
                mes,
                new BigDecimal[] {
                    BigDecimal.ZERO,
                    BigDecimal.ZERO
                }
            );
        }

        List<RegistroFinanceiro> registros =
            registroRepository
                .findAllByUser_IdAndDataGreaterThanEqualOrderByDataAscIdAsc(
                    user.getId(),
                    dataInicio
                );

        for (RegistroFinanceiro registro : registros) {

            YearMonth mes = YearMonth.from(registro.getData());
            BigDecimal[] valores = totais.get(mes);

            if (valores == null) {
                continue;
            }

            String tipo = registro.getTipo()
                .trim()
                .toUpperCase(Locale.ROOT);

            if (tipo.equals("ENTRADA")) {
                valores[0] = valores[0].add(registro.getValor());

            } else if (tipo.equals("SAIDA")) {
                valores[1] = valores[1].add(registro.getValor());
            }
        }

        DateTimeFormatter formatador =
            DateTimeFormatter.ofPattern(
                "MMM/yyyy",
                Locale.forLanguageTag("pt-BR")
            );

        List<DashboardMensalDTO> resultado = new ArrayList<>();

        for (Map.Entry<YearMonth, BigDecimal[]> entrada
                : totais.entrySet()) {

            BigDecimal[] valores = entrada.getValue();

            resultado.add(
                new DashboardMensalDTO(
                    entrada.getKey().atDay(1).format(formatador),
                    valores[0],
                    valores[1]
                )
            );
        }

        return resultado;
    }
}