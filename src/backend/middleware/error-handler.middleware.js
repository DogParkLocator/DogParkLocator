module.exports = function errorHandler(err, req, res, next) {
  console.error('ERROR', err.message);
  res.json({message: err.message, time: Date.now(), status: err.status || 500});
};
