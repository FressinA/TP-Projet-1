const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Vos autres configurations et routes
app.post('/register', (req, res) => {
    // Votre logique d'inscription
});

app.listen(3225, () => {
    console.log('Server is running on port 3225');
});