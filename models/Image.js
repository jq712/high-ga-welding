const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['all', 'pipes', 'structural']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Image", imageSchema);
