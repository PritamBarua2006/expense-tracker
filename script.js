const expenseCtx = document.getElementById("expenseChart");

new Chart(expenseCtx, {

    type: "line",

    data: {

        labels: ["Jan","Feb","Mar","Apr","May","Jun"],

        datasets: [{

            label: "Expenses",

            data: [1200,1800,1500,2200,1900,2500],

            borderColor: "#2563eb",

            backgroundColor: "rgba(37,99,235,.15)",

            fill: true,

            tension: .4

        }]

    }

});

const pieCtx = document.getElementById("pieChart");

new Chart(pieCtx, {

    type: "pie",

    data: {

        labels:["Food","Travel","Shopping","Bills"],

        datasets:[{

            data:[35,20,25,20],

            backgroundColor:[

                "#2563eb",

                "#10b981",

                "#f59e0b",

                "#ef4444"

            ]

        }]

    }

});

const expenses = [];

let editingIndex = null;

function updateDashboard() {

    let totalExpense = 0;

    for (const expense of expenses) {
        totalExpense += expense.amount;
    }

    expenseTotal.textContent = `₹${totalExpense}`;

}

function clearForm() {

    titleInput.value = "";
    amountInput.value = "";
    dateInput.value = "";

    categoryInput.selectedIndex = 0;
    paymentInput.selectedIndex = 0;

}

function closeModal() {

    const expenseModal =
        document.getElementById("expenseModal");

    const modal =
        bootstrap.Modal.getInstance(expenseModal);

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
            <button class="btn btn-sm btn-primary" data-index="${index}"> Edit </button>
            <button class="btn btn-sm btn-danger" data-index="${index}"> Delete </button> </td>
    `;

    transactionBody.appendChild(row);

}

function renderExpenses() {

    transactionBody.innerHTML = "";

    expenses.forEach((expense, index) => {

        addExpenseToTable(expense, index);

    });
}

function saveExpenses() {
    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

function loadExpenses() {

    const storedExpenses =
        localStorage.getItem("expenses");

    if (storedExpenses) {

        expenses.push(
            ...JSON.parse(storedExpenses)
        );

        renderExpenses();

        updateDashboard();

    }

}

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const paymentInput = document.getElementById("payment");
const dateInput = document.getElementById("date");

const expenseTotal = document.getElementById("expenseTotal");

const transactionBody = document.getElementById("transactionBody");


const saveBtn = document.getElementById("saveExpense");
saveBtn.addEventListener("click", function(){

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

if (editingIndex === null) {

    expenses.push(expense);

} else {

    expenses[editingIndex] = expense;

    editingIndex = null;

}

saveExpenses();

renderExpenses();

updateDashboard();

clearForm();

closeModal();
});

transactionBody.addEventListener("click", function(event){

    if (event.target.classList.contains("btn-primary")) {

    editingIndex = Number(event.target.dataset.index);

    const expense = expenses[editingIndex];

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
        const index = Number(event.target.dataset.index);
        expenses.splice(index, 1);
        const row = event.target.parentElement.parentElement;
        saveExpenses();
        renderExpenses();
        updateDashboard();
    }
});

loadExpenses();

