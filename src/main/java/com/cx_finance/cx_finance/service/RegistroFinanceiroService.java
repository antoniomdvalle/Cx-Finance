package com.cx_finance.cx_finance.service;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cx_finance.cx_finance.dto.RegistroFinanceiroRequest;
import com.cx_finance.cx_finance.dto.RegistroFinanceiroResponse;
import com.cx_finance.cx_finance.model.RegistroFinanceiro;
import com.cx_finance.cx_finance.model.User;
import com.cx_finance.cx_finance.repository.RegistroFinanceiroRepository;
import com.cx_finance.cx_finance.repository.UserRepository;

import java.util.List;

@Service
public class RegistroFinanceiroService {
    private final RegistroFinanceiroRepository registroRepository;
    private final UserRepository userRepository;

    public RegistroFinanceiroService(
            RegistroFinanceiroRepository registroRepository,
            UserRepository userRepository) {
        this.registroRepository = registroRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public Long criarRegistro(
            RegistroFinanceiroRequest requisicao,
            Long usuarioId) {

        if (requisicao == null) {
            throw new IllegalArgumentException(
                    "Os dados do registro não foram enviados.");
        }

        if (requisicao.getDescricao() == null
                || requisicao.getDescricao().isBlank()) {
            throw new IllegalArgumentException(
                    "A descrição é obrigatória.");
        }

        if (requisicao.getCategoria() == null
                || requisicao.getCategoria().isBlank()) {
            throw new IllegalArgumentException(
                    "A categoria é obrigatória.");
        }

        if (requisicao.getTipo() == null) {
            throw new IllegalArgumentException(
                    "Selecione entrada ou saída.");
        }

        String tipo = requisicao.getTipo()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!tipo.equals("ENTRADA") && !tipo.equals("SAIDA")) {
            throw new IllegalArgumentException(
                    "O tipo deve ser ENTRADA ou SAIDA.");
        }

        BigDecimal valor = requisicao.getValor();

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "O valor deve ser maior que zero.");
        }

        if (requisicao.getData() == null) {
            throw new IllegalArgumentException(
                    "A data é obrigatória.");
        }

        // Busca o usuário real no banco, utilizando o ID da sessão.
        // Não confiamos em um ID de usuário enviado pelo navegador.
        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new NoSuchElementException(
                        "O usuário da sessão não foi encontrado."));

        RegistroFinanceiro registro = new RegistroFinanceiro();

        registro.setDescricao(requisicao.getDescricao().trim());
        registro.setCategoria(requisicao.getCategoria().trim());
        registro.setTipo(tipo);
        registro.setValor(valor);
        registro.setData(requisicao.getData());
        registro.setUser(usuario);

        RegistroFinanceiro registroSalvo =
                registroRepository.save(registro);

        return registroSalvo.getId();
    }

        @Transactional(readOnly = true)
        public List<RegistroFinanceiroResponse> listarRegistrosDoUsuario(
                Long usuarioId) {

        return registroRepository
                .findAllByUser_IdOrderByDataDescIdDesc(usuarioId)
                .stream()
                .map(registro -> new RegistroFinanceiroResponse(
                        registro.getId(),
                        registro.getDescricao(),
                        registro.getCategoria(),
                        registro.getTipo(),
                        registro.getValor(),
                        registro.getData()
                ))
                .toList();
        }
}
