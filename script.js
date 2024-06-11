document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseDateInput = document.getElementById("expense-date");
    const expenseCategoryInput = document.getElementById("expense-category");
    const incomeAmountInput = document.getElementById("income-amount");
    const setIncomeButton = document.getElementById("set-income");
    const expenseList = document.getElementById("expense-list");
    const totalIncomeDisplay = document.getElementById("total-income");
    const totalExpenseDisplay = document.getElementById("total-expense");
    const balanceDisplay = document.getElementById("balance");
    const searchBar = document.getElementById("search-bar");
    const categoryFilter = document.getElementById("category-filter");
    const dateFilter = document.getElementById("date-filter");
    const clearFiltersButton = document.getElementById("clear-filters");
    const editExpenseButton = document.getElementById("edit-expense");

    // State Variables
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
    let balance = totalIncome;
    let totalExpenses = 0;
    let editingExpense = null;

    // Render Expenses
    function renderExpenses(filteredExpenses) {
        expenseList.innerHTML = '';
        filteredExpenses.forEach(expense => {
            const listItem = document.createElement("li");
            listItem.classList.add("expense-item");
            const expenseDetails = document.createElement("div");
            expenseDetails.classList.add("expense-details");
            expenseDetails.innerHTML = `<strong>${expense.name}</strong><br>Amount: $${expense.amount.toFixed(2)}<br>Date: ${expense.date}<br>Category: ${expense.category}`;

            const editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function() {
                editingExpense = expense;
                expenseNameInput.value = expense.name;
                expenseAmountInput.value = expense.amount;
                expenseDateInput.value = expense.date;
                expenseCategoryInput.value = expense.category;
            });

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function() {
                expenses = expenses.filter(e => e.id !== expense.id);
                saveExpenses();
                updateTotalExpenses();
                renderExpenses(filterExpenses());
                updateBalance();
            });

            listItem.appendChild(expenseDetails);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            expenseList.appendChild(listItem);
        });
    }

    // Filter Expenses
    function filterExpenses() {
        const searchText = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedDate = dateFilter.value;

        return expenses.filter(expense => {
            return (expense.name.toLowerCase().includes(searchText) || searchText === '') &&
                   (expense.category === selectedCategory || selectedCategory === '') &&
                   (expense.date === selectedDate || selectedDate === '');
        });
    }

    // Update Total Expenses
    function updateTotalExpenses() {
        totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        totalExpenseDisplay.textContent = totalExpenses.toFixed(2);
    }

    // Update Balance
    function updateBalance() {
        balance = totalIncome - totalExpenses;
        balanceDisplay.textContent = balance.toFixed(2);
    }

    // Save Expenses
    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('totalExpenses', totalExpenses.toFixed(2));
    }

    // Set Income
    setIncomeButton.addEventListener("click", function() {
        const incomeAmount = parseFloat(incomeAmountInput.value);

        if (!isNaN(incomeAmount) && incomeAmount > 0) {
            totalIncome = incomeAmount;
            localStorage.setItem('totalIncome', totalIncome.toFixed(2));
            totalIncomeDisplay.textContent = totalIncome.toFixed(2);
            updateBalance();
            incomeAmountInput.value = '';
        } else {
            alert("Please enter a valid income amount.");
        }
    });

    // Handle Expense Form Submission
    expenseForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const expenseName = expenseNameInput.value;
        const expenseAmount = parseFloat(expenseAmountInput.value);
        const expenseDate = expenseDateInput.value;
        const expenseCategory = expenseCategoryInput.value;

        if (expenseName === "" || isNaN(expenseAmount) || expenseAmount <= 0 || expenseDate === "" || expenseCategory === "") {
            alert("Please enter valid expense details.");
            return;
        }

        if (editingExpense) {
            editingExpense.name = expenseName;
            editingExpense.amount = expenseAmount;
            editingExpense.date = expenseDate;
            editingExpense.category = expenseCategory;
            editingExpense = null;
        } else {
            const expense = {
                id: Date.now(),
                name: expenseName,
                amount: expenseAmount,
                date: expenseDate,
                category: expenseCategory
            };
            expenses.push(expense);
        }

        saveExpenses();
        updateTotalExpenses();
        renderExpenses(filterExpenses());
        updateBalance();
        expenseForm.reset();
    });

    // Edit Expense Button Event Listener
    editExpenseButton.addEventListener("click", function() {
        if (editingExpense) {
            expenseForm.submit();
        } else {
            alert("Please select an expense to edit.");
        }
    });

    // Search Bar Event Listener
    searchBar.addEventListener("input", function() {
        renderExpenses(filterExpenses());
    });

    // Category Filter Event Listener
    categoryFilter.addEventListener("change", function() {
        renderExpenses(filterExpenses());
    });

    // Date Filter Event Listener
    dateFilter.addEventListener("change", function() {
        renderExpenses(filterExpenses());
    });

    // Clear Filters Event Listener
    clearFiltersButton.addEventListener("click", function() {
        searchBar.value = '';
        categoryFilter.value = '';
        dateFilter.value = '';
        renderExpenses(filterExpenses());
    });

    // Initial Render
    updateTotalExpenses();
    updateBalance();
    renderExpenses(filterExpenses());
});
