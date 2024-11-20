// Hardcoded admin credentials
const adminUsername = 'adminlib';
const adminPassword = 'admin@123';

// Admin login function
function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === adminUsername && password === adminPassword) {
        alert('Login successful! Redirecting to Admin Dashboard...');
        window.location.href = 'admin.html'; // Redirect to the admin page
    } else {
        alert('Invalid username or password. Please try again.');
    }
}
