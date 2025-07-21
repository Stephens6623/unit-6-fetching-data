// Function to fetch all books from the server and display them
async function loadBooks() {
    console.log('Starting to load books...');
    try {
        // Fetch books from your GET /books route
        const response = await fetch('/books');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const books = await response.json();
        console.log('Books received:', books);
        
        // Grab the container using DOM 
        const container = document.getElementById('books-container');
        
        if (!container) {
            console.error('books-container element not found!');
            return;
        }
        
        // Clear any existing content
        container.innerHTML = '';
        
        if (books.length === 0) {
            container.innerHTML = '<p>No books found. Add some books using the form below!</p>';
            return;
        }
        
        // Use map to create HTML for each book (as mentioned in README)
        books.map(book => {
            // Create elements for each book using DOM
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book-card';
            
            const title = document.createElement('h3');
            title.textContent = book.title;
            
            const author = document.createElement('p');
            author.textContent = `Author: ${book.author}`;
            
            const copies = document.createElement('p');
            copies.textContent = `Copies: ${book.copies}`;
            
            // IMPORTANT: Display the MongoDB ID so users can use it for updates
            const id = document.createElement('p');
            id.textContent = `ID: ${book._id}`;
            id.className = 'book-id';
            
            // Add all elements to the book div
            bookDiv.appendChild(title);
            bookDiv.appendChild(author);
            bookDiv.appendChild(copies);
            bookDiv.appendChild(id);
            
            // Add the book div to the container
            container.appendChild(bookDiv);
        });
        
    } catch (error) {
        console.error('Error loading books:', error);
        const container = document.getElementById('books-container');
        if (container) {
            container.innerHTML = `<p style="color: red;">Error loading books: ${error.message}. Check console for details.</p>`;
        }
    }
}

// Load books when the page loads
document.addEventListener('DOMContentLoaded', loadBooks);
