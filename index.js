// NEW TEST SERVER ARYAN IS MAKING

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/sign_up', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
