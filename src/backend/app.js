const express = require('express');
const bodyParser = require('body-parser');

require('./database-setup.js');

let app = express();
app.set('port', (process.env.PORT || 4000));
app.use(express.static(__dirname + '/../../build/'));
app.use(bodyParser.json());
app.use('/dog-parks', require('./routes/park.routes.js'));
app.use(require('./middleware/error-handler.middleware.js'));
app.listen(app.get('port'), function doSomethingOnceServerIsUp(err) {
  if(err) {
    console.error('The server could not be started:', err.message);
  } else {
    console.log('The server is available!');
  }
});
