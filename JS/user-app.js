// Function to fetch and display available books for the user
function fetchAvailableBooks() {
    fetch('http://localhost:3000/books') // Adjust the port if necessary
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            return response.json();
        })
        .then(books => {
            const booksList = document.getElementById('books-list');
            booksList.innerHTML = ''; // Clear previous entries

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <h3>${book.title}</h3>
                    <button onclick="rentBook(${book.id})">Rent</button>
                `;
                booksList.appendChild(bookCard);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            alert('Failed to load available books. Please try again later.');
        });
}

// Function to rent a book
function rentBook(bookId) {
    const userId = 1; // Replace this with the actual logged-in user's ID
    const requestBody = { userId, bookId };

    fetch('http://localhost:3000/rent', { // Adjust the port if necessary
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to rent book');
        }
        alert('Book rented successfully!');
        fetchAvailableBooks(); // Refresh the list of available books
        fetchRentedBooks(); // Refresh the rented books list
    })
    .catch(error => {
        console.error('Error renting book:', error);
        alert('Failed to rent book. Please try again later.');
    });
}

// Function to fetch and display rented books for the user
function fetchRentedBooks() {
    const userId = 1; // Replace this with the actual logged-in user's ID

    fetch(`http://localhost:3000/rented-books/${userId}`) // Adjust the port if necessary
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch rented books');
            }
            return response.json();
        })
        .then(rentedBooks => {
            const rentedBooksList = document.getElementById('rented-books-list');
            rentedBooksList.innerHTML = ''; // Clear previous entries

            rentedBooks.forEach(rental => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>Title:</strong> ${rental.title}<br>
                    <strong>Rented Date:</strong> ${new Date(rental.rented_date).toLocaleDateString()}<br>
                    <strong>Due Date:</strong> ${new Date(rental.due_date).toLocaleDateString()}<br>
                    <strong>Status:</strong> ${rental.returned ? 'Returned' : 'Not Returned'}<br>
                    <button onclick="removeRentedBook(${rental.id})">Remove</button> <!-- Remove button -->
                `;
                rentedBooksList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching rented books:', error);
            alert('Failed to load rented books. Please try again later.');
        });
}

// Function to remove a rented book
function removeRentedBook(rentalId) {
    fetch(`http://localhost:3000/remove-rented/${rentalId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove rented book');
        }
        alert('Rented book removed successfully!');
        fetchRentedBooks(); // Refresh the rented books list
        fetchAvailableBooks(); // Refresh the list of available books
    })
    .catch(error => {
        console.error('Error removing rented book:', error);
        alert('Failed to remove rented book. Please try again later.');
    });
}

// Initialize the book lists on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAvailableBooks();
    fetchRentedBooks();
});
