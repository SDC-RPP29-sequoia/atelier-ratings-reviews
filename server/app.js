const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
require('./cacheManager');
// parse application/json
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

routes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const error = new Error('Not Found')
	console.log(error)
	error.status = 404
	res.send('Route not found')
	next(error)
})
module.exports = app;