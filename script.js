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

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const paymentInput = document.getElementById("payment");
const dateInput = document.getElementById("date");


const saveBtn = document.getElementById("saveExpense");
saveBtn.addEventListener("click", function(){

    const expense = {
    title: titleInput.value,
    category: categoryInput.value,
    amount: Number(amountInput.value),
    payment: paymentInput.value,
    date: date(dateInput.value)
}
expenses.push(expense);
const row = document.createElement("tr");

row.innerHTML = `
    <td>${expense.date}</td>
    <td>${expense.category}</td>
    <td>${expense.title}</td>
    <td>₹${expense.amount}</td>
    <td>${expense.payment}</td>
    <td>
        <button>Edit</button>
        <button>Delete</button>
    </td>
`;

transactionBody.appendChild(row);
console.log(expenses);
});

const transactionBody = document.getElementById("transactionBody");

