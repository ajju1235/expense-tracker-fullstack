package com.expense.tracker.controller;

import com.expense.tracker.Expense;
import com.expense.tracker.User;
import com.expense.tracker.repository.UserRepository;
import com.expense.tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserRepository userRepository;

    // ✅ GET (auto user)
    @GetMapping
    public List<Expense> getAllExpenses() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username);

        return expenseService.getExpensesByUser(user);
    }

    // ✅ ADD
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username);

        return expenseService.addExpense(expense, user);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return "Deleted successfully ✅";
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,
                                 @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }
}