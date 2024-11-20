# Library Management System

A comprehensive library management system built using Node.js, Express, MySQL, and a frontend with HTML, CSS, and JavaScript. This application provides functionalities to manage users, books, and rentals efficiently.

## Features

- *User Registration and Login*: Secure password hashing for user authentication.
- *Book Management*: Add, view, and remove books from the library.
- *Rental Management*: Rent and return books with real-time availability updates.
- *User Rentals*: View rented books per user.
- *Member Management*: Manage members and their rental records.
- *Responsive Frontend*: User-friendly interface with real-time API integration.

## Prerequisites

Before you begin, ensure you have the following installed:

- *Node.js* (v16+)
- *MySQL* (v8+)
- *npm* (Node Package Manager)
- *Git* (optional, for cloning the repository)
- *Xampp*

## Getting Started

Follow these steps to set up the Library Management System on your local machine:

### 1. Clone the Repository

bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system


### 2. Install Dependencies

bash
npm install


### 3. Set Up the Database

1. Start your MySQL server.
2. Create a database named libraryDB:

sql
CREATE DATABASE libraryDB;


3. Import the database schema:

bash
mysql -u your-username -p libraryDB < schema.sql


4. Update the server.js file with your MySQL credentials:

javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'libraryDB'
});


### 4. Start the Server

bash
node server.js


The server will run on [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Authentication

- *POST /register*: Register a new user.
- *POST /login*: Login with username and password.

### Books

- *GET /books*: Fetch available books.
- *POST /books*: Add a new book.
- *DELETE /books/:id*: Remove a book.

### Rentals

- *POST /rent*: Rent a book.
- *GET /rented-books/:userId*: View rented books for a specific user.
- *DELETE /remove-rented/:rentalId*: Remove a rented book and mark it available.

### Members

- *GET /members*: View all members.
- *POST /members*: Add a new member.
- *DELETE /members/:id*: Remove a member.

## Frontend Integration

The frontend files (HTML, CSS, JS) interact with the backend APIs to provide a user-friendly interface for managing library operations. Ensure the server is running before accessing the frontend.

## Troubleshooting

### Common Issues

- *Database Connection Errors*: Check your MySQL credentials and ensure the database server is running.
- *Port Conflict*: If port 3000 is busy, update the server.js file with a different port.
- *Missing Dependencies*: Run npm install to install all required packages.

## Contributing

Feel free to contribute to this project! To contribute:

1. Fork the repository.
2. Create a new branch:

bash
git checkout -b feature/your-feature-name


3. Commit your changes:

bash
git commit -m 'Add some feature'


4. Push to the branch:

bash
git push origin feature/your-feature-name


5. Open a pull request.

---

Thank you for checking out the Library Management System! We hope you find it useful for managing your library operations effectively.
