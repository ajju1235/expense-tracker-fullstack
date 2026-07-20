package com.expense.tracker.repository;

import com.expense.tracker.Expense;
import com.expense.tracker.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);
}