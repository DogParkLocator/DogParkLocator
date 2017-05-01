const mongoose = require('mongoose');

let parkSchema = mongoose.Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  latitude: Number,
  longitude: Number,
  description: String,
  openHour: String,
  closeHour: String,
  likes: Number,
  dislikes: Number,
});

module.exports = mongoose.model('Park', parkSchema);
