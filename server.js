const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify(headerParser(req)));
});

app.listen(port, console.log(`Listening on port ${port}`));
