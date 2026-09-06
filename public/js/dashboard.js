// ======================================
// NexaCore Dashboard
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    // ==================================
    // Get Stored User
    // ==================================

    const storedUser =
        localStorage.getItem("nexacore_user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error(
            "Unable to read stored user:",
            error
        );
    }


    // ==================================
    // Get Token
    // ==================================

    const token =
        localStorage.getItem("nexacore_token");


    // ==================================
    // Protect Dashboard
    // ==================================

    if (!token) {
        console.warn("❌ No authentication token found.");
        window.location.href = "/login";
        return;
    }

    console.log("✅ Authentication token found.");
    console.log(
        "🔐 Token preview:",
        `${token.substring(0, 15)}...`
    );


    // ==================================
    // User Information
    // ==================================

    if (user) {

        const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`
                .trim();

        const firstName =
            user.firstName || "Student";

        const role =
            Array.isArray(user.roles) &&
                user.roles.length
                ? user.roles[0]
                : "student";


        const userName =
            document.getElementById("userName");

        const userRole =
            document.getElementById("userRole");

        const welcomeName =
            document.getElementById("welcomeName");

        const userInitials =
            document.getElementById("userInitials");


        if (userName) {
            userName.textContent =
                fullName || "NexaCore User";
        }


        if (userRole) {
            userRole.textContent =
                role.charAt(0).toUpperCase() +
                role.slice(1);
        }


        if (welcomeName) {
            welcomeName.textContent =
                firstName;
        }


        if (userInitials) {

            const initials =
                `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
                    .toUpperCase();

            userInitials.textContent =
                initials || "N";
        }

    }


    // ==================================
    // Load Student Dashboard Overview
    // ==================================

    try {

        console.log(
            "📡 Requesting student dashboard overview..."
        );

        const response = await fetch(
            "/api/student-dashboard/overview",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                credentials: "include"
            }
        );


        const data = await response.json();


        console.log(
            "📥 Dashboard API response:",
            data
        );


        // ==================================
        // Authentication Failed
        // ==================================

        if (response.status === 401) {

            console.error(
                "❌ Authentication failed."
            );

            console.error(
                "The token was rejected or was not received by the backend."
            );

            localStorage.removeItem(
                "nexacore_token"
            );

            localStorage.removeItem(
                "nexacore_user"
            );

            window.location.href = "/login";

            return;
        }


        // ==================================
        // Other API Error
        // ==================================

        if (!response.ok) {

            console.error(
                "❌ Dashboard request failed:",
                data
            );

            return;
        }


        // ==================================
        // Successful Response
        // ==================================

        console.log(
            "✅ Student dashboard loaded successfully."
        );


        const overview =
            data.data || {};


        // ==================================
        // Example Overview Elements
        // ==================================

        const totalEnrollments =
            document.getElementById(
                "totalEnrollments"
            );

        const activeCourses =
            document.getElementById(
                "activeCourses"
            );

        const completedCourses =
            document.getElementById(
                "completedCourses"
            );

        const certificates =
            document.getElementById(
                "certificates"
            );

        const wishlist =
            document.getElementById(
                "wishlist"
            );


        if (totalEnrollments) {
            totalEnrollments.textContent =
                overview.totalEnrollments ?? 0;
        }

        if (activeCourses) {
            activeCourses.textContent =
                overview.activeCourses ?? 0;
        }

        if (completedCourses) {
            completedCourses.textContent =
                overview.completedCourses ?? 0;
        }

        if (certificates) {
            certificates.textContent =
                overview.certificates ?? 0;
        }

        if (wishlist) {
            wishlist.textContent =
                overview.wishlist ?? 0;
        }


    } catch (error) {

        console.error(
            "❌ Dashboard request error:",
            error
        );

    }


    // ==================================
    // Sidebar
    // ==================================

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");


    if (sidebarToggle && sidebar) {

        sidebarToggle.addEventListener(
            "click",
            () => {
                sidebar.classList.toggle("open");
            }
        );

    }


    // ==================================
    // Logout
    // ==================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "nexacore_token"
                );

                localStorage.removeItem(
                    "nexacore_user"
                );

                window.location.href =
                    "/login";

            }
        );

    }

});