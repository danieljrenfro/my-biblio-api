const { NODE_ENV } = require('../config');

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  let response;
  
  // eslint-disable-next-line no-console
  console.log(error);
  NODE_ENV === 'production' 
    ? response = { error: { message: 'server error'}}
    : response = { message: error.message, error };
  res.status(500).json(response);
}

module.exports = errorHandler;