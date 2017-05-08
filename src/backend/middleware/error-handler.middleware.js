/**
 * [errorHandler description]
 * @param  {Object}   err  the error type and database details
 * @param  {Object}   req  the request that triggered this function
 * @param  {Object}   res  the response for the next middleware, or for the frontend
 * @param  {Function} next [description]
 * @return {void}
 */
module.exports = function errorHandler(err, req, res, next) {
  console.error('ERROR', err.message);
  res.json({message: err.message, time: Date.now(), status: err.status || 500});
};
