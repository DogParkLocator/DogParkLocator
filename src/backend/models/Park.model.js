const mongoose = require('mongoose');

let parkSchema = mongoose.Schema({
  id: String,
  name: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  latitude: String,
  longitude: String,
  description: String,
  openHour: String,
  closeHour: String,
  popularity: String
});

module.exports = mongoose.model('Park', parkSchema);
