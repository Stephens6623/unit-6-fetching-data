import express from 'express';
import Library from './library.js';

// Initialize Express app and MongoDB connection
const app = express();
const PORT = 8080

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from client folder
app.use(express.static('client'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

const collection = new Library('mongodb://localhost:27017', 'library', 'books');

await collection.client();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './client' });
});

app.get('/health', (req, res) => {
    res.send('Server is healthy');
})


app.get('/books', async (req, res) => {
    try {
        const cursor = await collection.getAllBooks();
        const books = await cursor.toArray();
        console.log('Found books:', books.length);
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.post('/books', async (req, res) => {
    try {
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            copies: req.body.copies
        };
        const result = await collection.addBook(newBook);
        console.log("Book added:", result);
        res.redirect('/'); // Redirect back to main page
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/books/update', async (req, res) => {
    try {
        const { id, title, author, copies } = req.body;
        console.log('Update request received:', { id, title, author, copies });
        
        if (!id || !title || !author || !copies) {
            throw new Error('Missing required fields');
        }
        
        const updatedInfo = { title, author, copies };
        const result = await collection.changebook(id, updatedInfo);
        console.log("Book updated:", result);
        res.redirect('/'); // Redirect back to main page
    } catch (error) {
        console.error("Error updating book:", error.message);
        console.error("Full error:", error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});






app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});