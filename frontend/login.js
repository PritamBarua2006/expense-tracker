const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.classList.remove("bi-eye");
        togglePassword.classList.add("bi-eye-slash");

    } else {

        passwordInput.type = "password";

        togglePassword.classList.remove("bi-eye-slash");
        togglePassword.classList.add("bi-eye");

    }

});

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

if (response.ok) {
    // Save JWT
    localStorage.setItem("token", data.token);

    // Save user (optional, but useful later)
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect to dashboard
    window.location.href = "index.html";
} else {
    alert(data.message);
}

    } catch (error) {
        console.error(error);
    }
});