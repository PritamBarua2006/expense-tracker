const token = localStorage.getItem("token");
console.log("Token:", token);

if (!token) {
    window.location.href = "login.html";
}

const expenseCtx = document.getElementById("expenseChart");

const expenseChart = new Chart(expenseCtx, {
    type: "line",
    data: {
        labels: [ "Jan","Feb","Mar","Apr", "May","Jun","Jul","Aug", "Sep","Oct","Nov","Dec"],
        datasets: [{
            label: "Expenses",
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,.15)",
            fill: true,
            tension: 0.4
        }]
    }
});

const pieCtx = document.getElementById("pieChart");

const pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
        labels: ["Food", "Travel", "Shopping", "Bills"],
        datasets: [{
            data: [0,0,0,0],
            backgroundColor: [
                "#2563eb",
                "#10b981",
                "#f59e0b",
                "#ef4444"
            ]
        }]
    }
});

const expenses = [];
let editingId = null;

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const paymentInput = document.getElementById("payment");
const dateInput = document.getElementById("date");

const expenseTotal = document.getElementById("expenseTotal");
const transactionBody = document.getElementById("transactionBody");
const saveBtn = document.getElementById("saveExpense");

const balanceTotal = document.getElementById("balanceTotal");
const savingsTotal = document.getElementById("savingsTotal");
const incomeTotal = document.getElementById("incomeTotal");

const searchInput = document.getElementById("searchInput");

function updateDashboard() {
    let totalExpense = 0;

    for (const expense of expenses) {
        totalExpense += expense.amount;
    }

    expenseTotal.textContent = `₹${totalExpense}`;
    balanceTotal.textContent = `₹${-totalExpense}`;
    savingsTotal.textContent = "₹0";
    incomeTotal.textContent = "₹0";
}

function updatePieChart() {

    const categoryTotals = {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        Bills: 0
    };

    for (const expense of expenses) {

        categoryTotals[expense.category] += expense.amount;

    }

    pieChart.data.datasets[0].data = [

        categoryTotals.Food,
        categoryTotals.Travel,
        categoryTotals.Shopping,
        categoryTotals.Bills

    ];

    pieChart.update();

}

function updateExpenseChart() {

    const monthlyExpenses = Array(12).fill(0);

    for (const expense of expenses) {

        const month = new Date(expense.date).getMonth();

        monthlyExpenses[month] += expense.amount;

    }

    expenseChart.data.datasets[0].data = monthlyExpenses;

    expenseChart.update();

}

function clearForm() {
    titleInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
    categoryInput.selectedIndex = 0;
    paymentInput.selectedIndex = 0;
}

function closeModal() {
    const expenseModal = document.getElementById("expenseModal");
    const modal = bootstrap.Modal.getInstance(expenseModal);
    modal.hide();
}

function addExpenseToTable(expense, index) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.category}</td>
        <td>${expense.title}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.payment}</td>
        <td>
            <button class="btn btn-sm btn-primary" data-id="${expense._id}">
                Edit
            </button>
            <button class="btn btn-sm btn-danger" data-id="${expense._id}">
                Delete
            </button>
        </td>
    `;

    transactionBody.appendChild(row);
}

function renderExpenses() {
    transactionBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        addExpenseToTable(expense, index);
    });
}

async function fetchExpenses() {

    try {

        const response = await fetch("http://localhost:3000/expenses",
            {
                cache: "no-store",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

        const data = await response.json();

        console.log(data);

        expenses.length = 0;

        expenses.push(...data);

        filterExpenses();

        updateDashboard();

        updatePieChart();

        updateExpenseChart();

    } catch (error) {

        console.error(error);

        alert("Unable to load expenses.");

    }

}

function filterExpenses() {

    const keyword =
        searchInput.value.toLowerCase();

    const filtered = expenses.filter(expense => {

        return expense.title
            .toLowerCase()
            .includes(keyword);

    });

    transactionBody.innerHTML = "";

    filtered.forEach(expense => {

        addExpenseToTable(expense);

    });

}

searchInput.addEventListener("input", filterExpenses);

saveBtn.addEventListener("click", async function () {

    if (
        titleInput.value.trim() === "" ||
        amountInput.value.trim() === "" ||
        dateInput.value === ""
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    const amount = Number(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    const expense = {
        title: titleInput.value.trim(),
        category: categoryInput.value,
        amount: amount,
        payment: paymentInput.value,
        date: dateInput.value
    };

    try {

        let response;

if (editingId === null) {

    response = await fetch(
        "http://localhost:3000/expenses",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(expense)
        }
    );

} else {

    response = await fetch(
        `http://localhost:3000/expenses/${editingId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(expense)
        }
    );
    if (response.status === 401) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Session expired. Please login again.");

    window.location.href = "login.html";

    return;
}
}
const result = await response.json();

        console.log(result);

        if (!response.ok) {
            alert("Failed to save expense.");
            return;
        }

    } catch (error) {
        console.error(error);
        alert("Cannot connect to backend.");
        return;
    }

    editingId = null;
    await fetchExpenses();
    clearForm();
    closeModal();
});

transactionBody.addEventListener("click", async function (event) {

    console.log(event.target);
    console.log(event.target.className);

    if (event.target.classList.contains("btn-primary")) {
        editingId = event.target.dataset.id;
        const expense = expenses.find(
            expense => expense._id === editingId
        );
        if (!expense) {
            alert("Expense not found.");
            return;
        }

        titleInput.value = expense.title;
        categoryInput.value = expense.category;
        amountInput.value = expense.amount;
        paymentInput.value = expense.payment;
        dateInput.value = expense.date;

        const expenseModal = new bootstrap.Modal(
            document.getElementById("expenseModal")
        );

        expenseModal.show();
    }

    if (event.target.classList.contains("btn-danger")) {

    const id = event.target.dataset.id;

    try {

        const response = await fetch(
            `http://localhost:3000/expenses/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            alert("Failed to delete expense.");
            return;
        }

        await fetchExpenses();

    } catch (error) {

        console.error(error);
        alert("Unable to delete expense.");

    }

}
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", logout);

fetchExpenses();

