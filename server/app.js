const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(routes);

app.use(express.json())
app.use(express.urlencoded({extended: true}));

module.exports = app;