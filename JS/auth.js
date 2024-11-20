// Show login form
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Show registration form
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Register a new user
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = 'user'; // Set the role as needed

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Send registration request to the backend
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        alert('Registration successful! You can now log in.');
        showLogin(); // Show the login form after successful registration

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Login an existing user
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Send login request to the backend
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        alert('Login successful!');
        window.location.href = 'user.html'; // Redirect to user page

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
