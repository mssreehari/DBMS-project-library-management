Library Management System
A comprehensive and basic library management system built using Node.js, Express, MySQL, and a frontend with HTML, CSS, and JavaScript. This application provides functionalities to manage users, books, and rentals efficiently.

Features
User registration and login with secure password hashing.
Add, view, and remove books from the library.
Rent and return books with real-time availability updates.
View rented books per user.
Manage members and their rental records.
Responsive frontend with real-time API integration.
Prerequisites
Node.js (v16+)
MySQL (v8+)
npm (Node Package Manager)
Git (optional, for cloning the repository)
Getting Started
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
2. Install Dependencies
bash
Copy code
npm install
3. Set Up the Database
Start your MySQL server.
Create a database named libraryDB:
sql
Copy code
CREATE DATABASE libraryDB;
Import the database schema:
bash
Copy code
mysql -u your-username -p libraryDB < schema.sql
Update the server.js file with your MySQL credentials:
javascript
Copy code
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'libraryDB'
});
4. Start the Server
bash
Copy code
node server.js
The server will run on http://localhost:3000.

API Endpoints
Authentication
POST /register: Register a new user.
POST /login: Login with username and password.
Books
GET /books: Fetch available books.
POST /books: Add a new book.
DELETE /books/:id: Remove a book.
Rentals
POST /rent: Rent a book.
GET /rented-books/:userId: View rented books for a specific user.
DELETE /remove-rented/:rentalId: Remove a rented book and mark it available.
Members
GET /members: View all members.
POST /members: Add a new member.
DELETE /members/:id: Remove a member.
Frontend Integration
The frontend files (HTML, CSS, JS) interact with the backend APIs to provide a user-friendly interface for managing library operations. Ensure the server is running before accessing the frontend.

Troubleshooting
Common Issues
Database Connection Errors: Check your MySQL credentials and ensure the database server is running.
Port Conflict: If port 3000 is busy, update the server.js file with a different port.
Missing Dependencies: Run npm install to install all required packages.
Contributing
Feel free to contribute to this project! To contribute:

Fork the repository.
Create a new branch: git checkout -b feature/your-feature-name.
Commit your changes: git commit -m 'Add some feature'.
Push to the branch: git push origin feature/your-feature-name.
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or support, reach out to:

Your Name: Sreehari
GitHub: mssreehari
