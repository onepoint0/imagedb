const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  img: { data: Buffer, contentType: String },
  createdDate: { type: Date, default: Date.now },
});

const Image = mongoose.model( 'Image', imageSchema);

module.exports = Image;