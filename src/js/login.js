// Ensure the function is defined before event listeners are added
document.addEventListener("DOMContentLoaded", function () {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
            // Check if login was successful
            if (responseData.token) {
                localStorage.setItem("token", responseData.token);
                window.location.href = "Monkeys.html";
            }
        } else {
            warningCard.classList.remove("d-none");
            warningText.innerText = responseData.message;
        }
    };

    const loginForm = document.getElementById("loginForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            console.log("loginForm.addEventListener");
            event.preventDefault();

            const username = document.getElementById("usernameLogin").value;
            const password = document.getElementById("passwordLogin").value;

            const data = { username, password };
            fetchMethod("http://localhost:3000/api/auth/login", callback, "POST", data);

            loginForm.reset();
        });
    }

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("usernameReg").value;
            const email = document.getElementById("emailReg").value;
            const password = document.getElementById("passwordReg").value;
            const confirmPassword = document.getElementById("confirmPasswordReg").value;

            if (password === confirmPassword) {
                console.log("Signup successful");
                console.log("Username:", username);
                console.log("Email:", email);
                console.log("Password:", password);
                warningCard.classList.add("d-none");

                const data = { username, email, password };

                const signupCallback = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);
                    if (responseStatus == 200) {
                        if (responseData.token) {
                            localStorage.setItem("token", responseData.token);
                            window.location.href = "Monkeys.html";
                        }
                    } else {
                        warningCard.classList.remove("d-none");
                        warningText.innerText = responseData.message;
                    }
                };

                fetchMethod("http://localhost:3000/api/auth/register", signupCallback, "POST", data);

                registerForm.reset();
            } else {
                warningCard.classList.remove("d-none");
                warningText.innerText = "Passwords do not match";
            }
        });
    }
});
