const express = require('express');
const authMiddleware = require('./middleware/auth');
const path = require('path');

// load environment variables from .env file for all files 
require('dotenv').config({path: path.join(__dirname, '../../../.env')});

const app = express();
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: "ok" })
});

app.post('/ingest', authMiddleware, (req, res) => {
  res.status(202).json({ status: "ingest ok" })
});


app.listen(3000, () => {
  console.log('API server listening on port 3000');
});