// Fetch API URL (update with your actual backend URL)
const API_URL = 'http://localhost:3000'; // Replace YOUR_PORT with your actual port number

// Display Books for Admin
const adminBooksList = document.getElementById('admin-books-list');
const membersList = document.getElementById('members-list');

// Function to fetch and display books from the backend
function displayAdminBooks() {
    fetch(`${API_URL}/books`)
        .then(response => response.json())
        .then(books => {
            adminBooksList.innerHTML = '';
            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <h3>${book.title}</h3>
                    <button onclick="removeBook(${book.id})">Remove</button>
                `;
                adminBooksList.appendChild(bookCard);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Add New Book
function addBook() {
    const bookTitle = document.getElementById('new-book-title').value;
    if (bookTitle.trim()) {
        const newBook = {
            title: bookTitle,
        };
        fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add book');
            }
            return response.json();
        })
        .then(data => {
            alert('Book added successfully!');
            // Refresh the book list or any other action needed
            displayAdminBooks();
        })
        .catch(error => {
            console.error('Error adding book:', error);
            alert('Failed to add book. Please try again later.');
        });
    } else {
        alert('Please enter a book title.');
    }
}

// Function to remove a book
function removeBook(bookId) {
    // Implement removal logic
    fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE', // Assuming you have a DELETE route set up
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove book');
        }
        displayAdminBooks(); // Refresh the book list
        alert('Book removed successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

// Function to display members
function displayMembers() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = ''; // Clear existing list

    // Fetch members from the backend
    fetch('http://localhost:3000/members') // Adjust the port if needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }
            return response.json();
        })
        .then(members => {
            members.forEach(member => {
                const listItem = document.createElement('li');
                listItem.textContent = member.name;

                // Create a remove button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = () => removeMember(member.id);

                listItem.appendChild(removeButton);
                membersList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching members:', error);
            alert('Error fetching members: ' + error.message);
        });
}

// Function to add a new member
function addMember() {
    const memberName = document.getElementById('new-member-name').value;

    if (!memberName) {
        alert('Please enter a member name.');
        return;
    }

    // Create the member object
    const newMember = { name: memberName };

    // Make a POST request to the backend
    fetch('http://localhost:3000/members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMember)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add member');
        }
        return response.json();
    })
    .then(data => {
        console.log('Member added successfully:', data);
        displayMembers(); // Refresh the member list
        document.getElementById('new-member-name').value = ''; // Clear input
    })
    .catch(error => {
        console.error('Error adding member:', error);
        alert('Error adding member: ' + error.message);
    });
}

// Function to remove a member
function removeMember(memberId) {
    // Make a DELETE request to the backend
    fetch(`http://localhost:3000/members/${memberId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove member');
        }
        console.log('Member removed successfully');
        displayMembers(); // Refresh the member list
    })
    .catch(error => {
        console.error('Error removing member:', error);
        alert('Error removing member: ' + error.message);
    });
}

// Initialize the Admin Page
;// Fetch and display the members when the page loads

// Initialize the Admin Page
displayAdminBooks(); // Fetch and display the books on page load
displayMembers();
