const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const partnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    partnerImage: {
      type: String,
      required: false,
    },
  }
 
);

module.exports = mongoose.model("Partner", partnerSchema);
