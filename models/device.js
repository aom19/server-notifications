const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pushSubscription: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
