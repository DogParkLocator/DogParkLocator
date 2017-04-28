const mongoose = require('mongoose');

let parkSchema = mongoose.Schema({
  id: String,
  name: String,
  street: String,
  city: String,
  state: String,
  zipcode: Number,
  latitude: String,
  longitude: String,
  description: String,
  openHour: String,
  closeHour: String,
  likes: Number,
  dislikes: Number,
});

module.exports = mongoose.model('Park', parkSchema);
