package com.cx_finance.cx_finance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data 
@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da meta é obrigatório.")
    @Column(nullable = false)
    private String nomeMeta;

    @NotNull(message = "O valor objetivo é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor objetivo deve ser maior que zero.")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valorObjetivo;

    @NotNull(message = "O valor guardado é obrigatório.")
    @DecimalMin(value = "0.00", message = "O valor guardado não pode ser negativo.")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valorGuardado;

    @NotNull(message = "O prazo é obrigatório.")
    @Column(nullable = false)
    private LocalDate prazo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
