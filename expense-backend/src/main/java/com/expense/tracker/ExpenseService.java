package com.expense.tracker.service;

import com.expense.tracker.Expense;
import com.expense.tracker.User;
import com.expense.tracker.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // ✅ GET USER EXPENSES
    public List<Expense> getExpensesByUser(User user) {

        return expenseRepository.findByUser(user);
    }

    // ✅ ADD EXPENSE
    public Expense addExpense(Expense expense, User user) {

        // 🔥 SET USER
        expense.setUser(user);

        // ✅ createdAt auto set ho raha hai Expense.java me
        return expenseRepository.save(expense);
    }

    // ✅ DELETE
    public void deleteExpense(Long id) {

        expenseRepository.deleteById(id);
    }

    // ✅ UPDATE
    public Expense updateExpense(Long id, Expense updated) {

        Expense existing = expenseRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException("Expense not found ❌"));

        // 🔥 UPDATE DATA
        existing.setTitle(updated.getTitle());

        existing.setAmount(updated.getAmount());

        existing.setCategory(updated.getCategory());

        // ✅ createdAt same rahega

        return expenseRepository.save(existing);
    }
}