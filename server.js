const express = require('express');
const cors = require('cors');

const routes = require('./server/routes');

const app = express();
app.use(cors());
app.use(routes);

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const port = 3000;

app.listen(port, () => {
  console.log(`NSA is listening in at http://localhost:${port}`);
});

module.exports = app;