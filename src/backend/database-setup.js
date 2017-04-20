const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.error('No database selected!');
  process.exit();
}

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('error', function handleDBError(err) {
  console.error('DB Error', err);
  process.exit();
});
