const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const DbService = require('./dbservice');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'librarydb',      // Replace with your database username
    password: 'haribhadrasql',   // Replace with your database password
    database: 'libraryDB'        // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + db.state);
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if username is already taken
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertSql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Failed to register user' });
            }
            return res.status(201).json({ message: 'Registration successful' });
        });
    });
});

// Login user (admin or user)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({ message: 'Error finding user' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (isMatch) {
                return res.status(200).json({ message: 'Login successful' });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        });
    });
});

// Get list of available books
app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM books WHERE available = true';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving books');
        }
        res.json(results);
    });
});

// Add a new book
app.post('/books', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const sql = 'INSERT INTO books (title, available) VALUES (?, ?)';
    DbService.getDbServiceInstance().query(sql, [title, true], (err, result) => {
        if (err) {
            console.error('Error adding book:', err);
            return res.status(500).json({ message: 'Failed to add book', error: err.message });
        }
        res.status(201).json({ id: result.insertId, title, available: true });
    });
});

// Remove a book (Assuming you want this functionality)
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = 'DELETE FROM books WHERE id = ?';

    db.query(sql, [bookId], (err, result) => {
        if (err) {
            console.error('Error removing book:', err);
            return res.status(500).send('Error removing book');
        }
        res.status(200).json({ message: 'Book removed successfully' });
    });
});

app.post('/rent', (req, res) => {
    const { userId, bookId } = req.body;

    console.log(`Received request to rent book. User ID: ${userId}, Book ID: ${bookId}`);

    // Check if userId and bookId are provided
    if (!userId || !bookId) {
        return res.status(400).send('userId and bookId are required');
    }

    const rentSql = 'INSERT INTO rentals (user_id, book_id) VALUES (?, ?)';
    const updateBookSql = 'UPDATE books SET available = false WHERE id = ?';

    db.query(rentSql, [userId, bookId], (err, result) => {
        if (err) {
            console.error('Error renting book:', err); // Log the error
            return res.status(500).send('Error renting book'); // Send a generic error message
        }

        db.query(updateBookSql, [bookId], (err, result) => {
            if (err) {
                console.error('Error updating book availability:', err); // Log the error
                return res.status(500).send('Error updating book availability'); // Send a generic error message
            }

            res.send('Book rented successfully');
        });
    });
});

// Route to fetch rented books for a specific user
app.get('/rented-books/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT books.title, rentals.rented_date, rentals.due_date, rentals.returned, rentals.id 
        FROM rentals
        JOIN books ON rentals.book_id = books.id
        WHERE rentals.user_id = ? AND rentals.returned = 0
    `; // Fetch books that haven't been returned (returned = 0)

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching rented books:', err);
            return res.status(500).send('Failed to fetch rented books');
        }

        res.status(200).json(results);
    });
});

app.delete('/remove-rented/:rentalId', (req, res) => {
    const rentalId = req.params.rentalId;
    
    console.log(`Attempting to remove rental with ID: ${rentalId}`);

    const getBookIdSql = 'SELECT book_id FROM rentals WHERE id = ?';
    db.query(getBookIdSql, [rentalId], (err, result) => {
        if (err) {
            console.error('Error finding rental record:', err);
            return res.status(500).send('Failed to remove rented book. Please try again later.');
        }

        if (result.length === 0) {
            return res.status(404).send('No rental record found with that ID.');
        }

        const bookId = result[0].book_id; 
        console.log(`Fetched book ID: ${bookId}`);

        const deleteRentalSql = 'DELETE FROM rentals WHERE id = ?';
        db.query(deleteRentalSql, [rentalId], (err, result) => {
            if (err) {
                console.error('Error removing rented book:', err);
                return res.status(500).send('Failed to remove rented book. Please try again later.');
            }

            const updateBookSql = 'UPDATE books SET available = true WHERE id = ?';
            db.query(updateBookSql, [bookId], (err, result) => {
                if (err) {
                    console.error('Error updating book availability:', err);
                    return res.status(500).send('Failed to update book availability. Please try again later.');
                }

                console.log(`Book with ID ${bookId} marked as available. Rows affected: ${result.affectedRows}`);
                res.status(200).send('Rented book removed successfully and marked as available.');
            });
        });
    });
});



// Get all members
app.get('/members', (req, res) => {
    const sql = 'SELECT * FROM members'; // Adjust this query according to your database schema
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving members');
        }
        res.json(results);
    });
});

// Add a new member
app.post('/members', (req, res) => {
    const { name } = req.body;

    const sql = 'INSERT INTO members (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Error adding member:', err);
            return res.status(500).send('Error adding member');
        }
        res.status(201).json({ id: result.insertId, name });
    });
});

// Remove a member
app.delete('/members/:id', (req, res) => {
    const memberId = req.params.id;

    const sql = 'DELETE FROM members WHERE id = ?';
    db.query(sql, [memberId], (err, result) => {
        if (err) {
            console.error('Error removing member:', err);
            return res.status(500).send('Error removing member');
        }
        res.status(204).send(); // No content response
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // Default to port 3000 if not specified
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
