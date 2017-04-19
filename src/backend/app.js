const express = require('express');
const bodyParser = require('body-parser');

require('./database-setup.js');

let app = express();
app.use(express.static(__dirname + '/../../build/'));
app.use(bodyParser.json());


app.use('/api/parks', require('./routes/park.routes.js'));

app.use(require('./middleware/error-handler.middleware.js'));

app.listen(4000, function doSomethingOnceServerIsUp(err) {
  if(err) {
    console.error('The server could not be started:', err.message);
  } else {
    console.log('The server is available!');
  }
});
