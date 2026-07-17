const express = require('express');
const routes = require('./routes/index');

const app = express();

app.use(express.json());

app.use('/api/v1/', routes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from Backend!" });
});

module.exports = app; 
