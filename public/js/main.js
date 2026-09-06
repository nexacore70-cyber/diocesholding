const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
}

// ======================================
// NexaCore Registration
// ======================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const registerButton =
            document.getElementById("registerButton");

        const buttonText =
            registerButton.querySelector(".button-text");

        const buttonLoader =
            registerButton.querySelector(".button-loader");

        const errorBox =
            document.getElementById("registerError");

        const successBox =
            document.getElementById("registerSuccess");

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        errorBox.style.display = "none";
        successBox.style.display = "none";

        if (password !== confirmPassword) {
            errorBox.textContent = "Passwords do not match.";
            errorBox.style.display = "block";
            return;
        }

        const formData = new FormData(registerForm);

        const data = {
            firstName: formData.get("firstName").trim(),
            lastName: formData.get("lastName").trim(),
            username: formData.get("username").trim(),
            email: formData.get("email").trim(),
            phone: formData.get("phone").trim(),
            password: password,
            confirmPassword: confirmPassword,
        };

        try {

            registerButton.disabled = true;

            buttonText.style.display = "none";
            buttonLoader.style.display = "inline";

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to complete registration."
                );
            }

            successBox.textContent =
                result.message ||
                "Registration successful. Welcome to NexaCore!";

            successBox.style.display = "block";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            errorBox.textContent =
                error.message ||
                "Unable to complete registration.";

            errorBox.style.display = "block";

        } finally {

            registerButton.disabled = false;

            buttonText.style.display = "inline";
            buttonLoader.style.display = "none";

        }
    });
}


// ======================================
// Password Visibility
// ======================================

document
    .querySelectorAll(".password-toggle")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.target;

            const input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }

            if (input.type === "password") {

                input.type = "text";
                button.textContent = "Hide";

            } else {

                input.type = "password";
                button.textContent = "Show";

            }

        });

    });

    // ======================================
// NexaCore Login
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const loginButton =
            document.getElementById("loginButton");

        const buttonText =
            loginButton.querySelector(".button-text");

        const buttonLoader =
            loginButton.querySelector(".button-loader");

        const errorBox =
            document.getElementById("loginError");

        const successBox =
            document.getElementById("loginSuccess");

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        // --------------------------------------
        // Clear previous messages
        // --------------------------------------

        errorBox.style.display = "none";
        successBox.style.display = "none";

        // --------------------------------------
        // Basic validation
        // --------------------------------------

        if (!email || !password) {
            errorBox.textContent =
                "Email and password are required.";

            errorBox.style.display = "block";

            return;
        }

        // --------------------------------------
        // Login
        // --------------------------------------

        try {

            loginButton.disabled = true;

            buttonText.style.display = "none";
            buttonLoader.style.display = "inline";

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const result = await response.json();

            // --------------------------------------
            // Backend error
            // --------------------------------------

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to sign in."
                );
            }

            // --------------------------------------
            // Save authentication token
            // --------------------------------------

            if (result.token) {
                localStorage.setItem(
                    "nexacore_token",
                    result.token
                );
            }

            // --------------------------------------
            // Save user information
            // --------------------------------------

            if (result.user) {
                localStorage.setItem(
                    "nexacore_user",
                    JSON.stringify(result.user)
                );
            }

            // --------------------------------------
            // Success
            // --------------------------------------

            successBox.textContent =
                result.message ||
                "Login successful.";

            successBox.style.display = "block";

            // --------------------------------------
            // Redirect
            // --------------------------------------

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            errorBox.textContent =
                error.message ||
                "Unable to sign in.";

            errorBox.style.display = "block";

        } finally {

            loginButton.disabled = false;

            buttonText.style.display = "inline";
            buttonLoader.style.display = "none";

        }
    });
}