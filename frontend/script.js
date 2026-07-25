const token = localStorage.getItem("token");
const welcomeText = document.getElementById("welcomeText");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const dateFilter = document.getElementById("dateFilter");

const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");

const spentTotal = document.getElementById("spentTotal");
const budgetTotal = document.getElementById("budgetTotal");
const remainingTotal = document.getElementById("remainingTotal");

const themeToggle = document.getElementById("themeToggle");

let currentPage = 1;
const rowsPerPage = 10;

if (!token) {
  window.location.href = "login.html";
}

const expenseCtx = document.getElementById("expenseChart");

const expenseChart = new Chart(expenseCtx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    datasets: [
      {
        label: "Expenses",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,.15)",
        fill: true,
        tension: 0.4
      }
    ]
  }
});

const pieCtx = document.getElementById("pieChart");

const pieChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: ["Food", "Travel", "Shopping", "Bills"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ["Food", "Travel", "Shopping", "Bills"].map(
          getCategoryColor
        )
      }
    ]
  }
});

const expenses = [];
let editingId = null;

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const paymentInput = document.getElementById("payment");
const dateInput = document.getElementById("date");

const transactionBody = document.getElementById("transactionBody");
const saveBtn = document.getElementById("saveExpense");


const searchInput = document.getElementById("searchInput");

const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

function updateDashboard() {

}

function updateSpentCard() {

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlySpent = expenses.reduce((total, expense) => {

        const expenseDate = new Date(expense.date);

        if (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ) {
            return total + Number(expense.amount);
        }

        return total;

    }, 0);

    spentTotal.textContent =
        `₹${monthlySpent.toLocaleString("en-IN")}`;

}

function updateRemainingCard() {

    const budget = Number(
        budgetTotal.textContent.replace(/[₹,]/g, "")
    ) || 0;

    const spent = Number(
        spentTotal.textContent.replace(/[₹,]/g, "")
    ) || 0;

    const remaining = budget - spent;

    remainingTotal.textContent =
        `₹${remaining.toLocaleString("en-IN")}`;
}

function updatePieChart() {

    const categoryTotals = {};

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    expenses.forEach((expense) => {

        const expenseDate = new Date(expense.date);

        if (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ) {

            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }

            categoryTotals[expense.category] += Number(expense.amount);
        }
    });

    const labels = Object.keys(categoryTotals);

    pieChart.data.labels = labels;

    pieChart.data.datasets[0].data = Object.values(categoryTotals);

    pieChart.data.datasets[0].backgroundColor =
        labels.map(getCategoryColor);

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

function addExpenseToTable(expense) {
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.category}</td>
        <td>${expense.title}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.payment}</td>
        <td>
            <button
                class="btn btn-sm btn-primary action-btn edit-btn"
                data-id="${expense._id}">
                <i class="bi bi-pencil-square"></i> Edit
            </button>

            <button
                class="btn btn-sm btn-danger action-btn delete-btn"
                data-id="${expense._id}">
                <i class="bi bi-trash"></i> Delete
            </button>
        </td>
    `;

  transactionBody.appendChild(row);
}

function getCategoryColor(category) {
  const colors = {
    Food: "#1D4ED8",
    Travel: "#10B981",
    Shopping: "#F59E0B",
    Bills: "#EF4444"
  };

  return colors[category] || "#6B7280";
}

function populateCategoryFilter() {
  categoryFilter.innerHTML = '<option value="All">All Categories</option>';

  const categories = [
    ...new Set(expenses.map((expense) => expense.category))
  ].sort();

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;

    option.textContent = category;

    categoryFilter.appendChild(option);
  });
}

function renderExpenses() {
  transactionBody.innerHTML = "";

  expenses.forEach((expense, index) => {
    addExpenseToTable(expense, index);
  });
}

function updateBudgetProgress(expenses) {
  const categoryColors = {
    Food: "#1D4ED8",
    Travel: "#10B981",
    Shopping: "#F59E0B",
    Bills: "#EF4444"
  };

  const container = document.getElementById("budgetProgressContainer");

  container.innerHTML = "";

  if (expenses.length === 0) {
    container.innerHTML = "<p>No expense data available.</p>";
    return;
  }

  const categoryTotals = {};

  let totalExpense = 0;

  expenses.forEach((expense) => {
    const amount = Number(expense.amount);

    totalExpense += amount;

    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += amount;
  });

  Object.entries(categoryTotals).forEach(([category, amount]) => {
    const percentage = ((amount / totalExpense) * 100).toFixed(1);

    const color = getCategoryColor(category);

    const item = document.createElement("div");

    item.className = "budget-item";

    item.innerHTML = `
            <div class="budget-info">
                <span>${category}</span>
                <span>${percentage}%</span>
            </div>

            <div class="progress">
                <div
                    class="progress-bar"
                    style= "width:${percentage}%;
                    background:${color};">
                </div>
            </div>
        `;

    container.appendChild(item);
  });
}

function updateInsights(expenses) {
  const container = document.getElementById("insightsContainer");

  container.innerHTML = "";

  if (expenses.length === 0) {
    container.innerHTML = "<p>No insights available.</p>";

    return;
  }

  // Highest Expense
  const highestExpense = expenses.reduce((max, expense) =>
    expense.amount > max.amount ? expense : max
  );

  // Total Transactions
  const totalTransactions = expenses.length;

  // Average Expense
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const averageExpense = Math.round(totalExpense / totalTransactions);

  // Most Used Category
  const categoryCount = {};

  expenses.forEach((expense) => {
    categoryCount[expense.category] =
      (categoryCount[expense.category] || 0) + 1;
  });

  const mostUsedCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  container.innerHTML = ` 

        <div class="insight">
            <div>
                <strong>Highest Expense</strong>
                <p> ${highestExpense.title} • ₹${Number(highestExpense.amount).toLocaleString("en-IN")} •
                    ${new Date(highestExpense.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                    })}
                </p>
            </div>
        </div>

        <div class="insight">
            <div>
                <strong>Most Used Category</strong>
                <p>${mostUsedCategory[0]} (${
                mostUsedCategory[1]
                } transactions)</p>
            </div>
        </div>

        <div class="insight">
            <div>
                <strong>Average Expense</strong>
                <p>₹${averageExpense.toLocaleString("en-IN")}</p>
            </div>
        </div>

        <div class="insight">
            <div>
                <strong>Total Transactions</strong>
                <p>${totalTransactions}</p>
            </div>
        </div>

    `;
}

async function fetchExpenses() {
  try {
    const response = await fetch("http://localhost:3000/expenses", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();

    console.log(data);

    expenses.length = 0;

    expenses.push(...data);

    populateCategoryFilter();

    filterExpenses();

    updateDashboard();

    updateSpentCard();

    updateRemainingCard();

    updateBudgetProgress(expenses);

    updateInsights(expenses);

    updatePieChart();

    updateExpenseChart();
  } catch (error) {
    console.error(error);

    alert("Unable to load expenses.");
  }
}

function filterExpenses() {
  const keyword = searchInput.value.toLowerCase();

  const selectedCategory = categoryFilter.value;

  const selectedSort = sortFilter.value;

  const selectedDate = dateFilter.value;

  let filtered = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(keyword);

    const matchesCategory =
      selectedCategory === "All" || expense.category === selectedCategory;

    const expenseDate = new Date(expense.date);
    const today = new Date();
    let matchesDate = true;
    switch (selectedDate) {
      case "today":
        matchesDate =
          expenseDate.toDateString() === today.toDateString();
        break;

      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        matchesDate = expenseDate >= weekStart;
        break;

      case "month":
        matchesDate =
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear();

        break;

      case "year":
        matchesDate =
          expenseDate.getFullYear() === today.getFullYear();

        break;
    }
    return matchesSearch && matchesCategory && matchesDate;
  });

  switch (selectedSort) {
    case "highest":
      filtered.sort((a, b) => b.amount - a.amount);
      break;

    case "lowest":
      filtered.sort((a, b) => a.amount - b.amount);
      break;

    case "oldest":
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;

    default:
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  transactionBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedExpenses = filtered.slice(start, end);
  transactionBody.innerHTML = "";
  paginatedExpenses.forEach(addExpenseToTable);

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

async function saveBudget() {
  const amount = Number(budgetInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid budget.");

    return;
  }

  try {
    const response = await fetch("http://localhost:3000/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        amount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);

      return;
    }

    budgetTotal.textContent = `₹${Number(data.amount).toLocaleString(
      "en-IN"
    )}`;

    updateRemainingCard();

    bootstrap.Modal.getInstance(
      document.getElementById("budgetModal")
    ).hide();

    budgetInput.value = "";
  } catch (error) {
    console.error(error);

    alert("Unable to save budget.");
  }
}

searchInput.addEventListener("input", filterExpenses);

categoryFilter.addEventListener("change", filterExpenses);

sortFilter.addEventListener("change", filterExpenses);

dateFilter.addEventListener("change", filterExpenses);

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
      response = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });
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

prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        filterExpenses();
    }
});

nextPage.addEventListener("click", () => {
    const filteredCount = expenses.length;
    const totalPages = Math.ceil(filteredCount / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;

          filterExpenses();
        }
      });

transactionBody.addEventListener("click", async function (event) {
  console.log(event.target);
  console.log(event.target.className);

  if (event.target.classList.contains("btn-primary")) {
    editingId = event.target.dataset.id;
    const expense = expenses.find((expense) => expense._id === editingId);
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

saveBudgetBtn.addEventListener("click", saveBudget);

async function fetchBudget() {

    try {

        const response = await fetch(
            "http://localhost:3000/budget",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(data.message);

            return;

        }

        budgetTotal.textContent =
            `₹${Number(data.amount).toLocaleString("en-IN")}`;

            updateRemainingCard();

    } catch (error) {

        console.error(error);

    }

}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", logout);

function updateWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) return;

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 17) {
        greeting = "Good Afternoon";
    }

    welcomeText.textContent = `${greeting}, ${currentUser.name} 👋`;
}

// ---------- Dark Mode ----------

function loadTheme() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return;
    const savedTheme = localStorage.getItem(`theme_${currentUser.id}`);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';

    } else {

        localStorage.setItem(`theme_${currentUser._id}`,"dark");
        themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';

    }

});

loadTheme();
updateWelcomeMessage();
fetchExpenses();
fetchBudget();