const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const registerBtn = document.getElementById("registerBtn");

const togglePassword = document.getElementById("togglePassword");

const confirmPasswordInput = document.getElementById("confirmPassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

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

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";

        toggleConfirmPassword.classList.remove("bi-eye");
        toggleConfirmPassword.classList.add("bi-eye-slash");

    } else {

        confirmPasswordInput.type = "password";

        toggleConfirmPassword.classList.remove("bi-eye-slash");
        toggleConfirmPassword.classList.add("bi-eye");

    }

});

registerBtn.addEventListener("click", registerUser);

async function registerUser() {

    if (
        nameInput.value.trim() === "" ||
        emailInput.value.trim() === "" ||
        passwordInput.value.trim() === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    try {

        const response = await fetch(
            "https://expense-tracker-xti3.onrender.com/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        const result = await response.json();

        console.log(result);

        if (!response.ok) {
            alert(result.message || "Registration failed.");
            return;
        }

        alert("Registration successful! Please login.");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

}