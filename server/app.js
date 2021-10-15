const express = require('express');
const cors = require('cors');
const routes = require('./routes');
// const redis = require('./middleware/redis');

const app = express();

app.use(cors());
app.use(routes);
// app.use(redis);

app.use(express.json())
app.use(express.urlencoded({extended: true}));

module.exports = app;