package com.cx_finance.cx_finance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cx_finance.cx_finance.model.RegistroFinanceiro;

import java.util.List;

public interface RegistroFinanceiroRepository extends JpaRepository<RegistroFinanceiro, Long>{
    List<RegistroFinanceiro> findAllByUserId(Long userId);
    List<RegistroFinanceiro> findAllByUser_IdOrderByDataDescIdDesc(Long userId);
    List<RegistroFinanceiro>
    findAllByUser_IdAndDataGreaterThanEqualOrderByDataAscIdAsc(
        Long userId,
        java.time.LocalDate data
    );
}
