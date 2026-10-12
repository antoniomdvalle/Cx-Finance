package com.cx_finance.cx_finance.repository;

import com.cx_finance.cx_finance.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUser_IdOrderByPrazoAsc(Long userId);

    Optional<Goal> findByIdAndUser_Id(Long id, Long userId);
}