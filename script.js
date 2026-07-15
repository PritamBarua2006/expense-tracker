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

const expenses = [

    {
        title: "Pizza",
        category: "Food",
        amount: 450,
        payment: "UPI"
    }

];

expenses.push({

    title: "Petrol",
    category: "Fuel",
    amount: 2200,
    payment: "Card"

});

console.log(expenses);