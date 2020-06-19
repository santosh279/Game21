const error_message = require('../resources/error_responses.json');

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.error_response = {
      statusCode: statusCode || 500,
      message: error_message[message] || "Internal Server Error"
    }
  }
}


const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
