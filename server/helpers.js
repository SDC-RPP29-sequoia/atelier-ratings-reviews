module.exports = {
	sendResponse({
		res,
    statusCode = 200,
    responseBody,
  })
  {
    res.status(statusCode).send(responseBody);
	},

	sendErrorResponse({
		res,
    statusCode = 500,
    message = 'error',
    responseBody,
	})
  {
		res.status(statusCode).send({
			data: responseBody,
			status: false,
			message,
		});
  }
}