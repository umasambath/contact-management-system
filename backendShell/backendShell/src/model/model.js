const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  uId: { type: String, required: true, unique: true },
  firstName: {
    type: String,
    required: [true, 'First Name is required'],

  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Phone number must be 10 digits long'],
  },
  email: {
    type: String,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },

  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});
module.exports = mongoose.model('Contact', contactSchema);