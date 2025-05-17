const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  symptoms: [String],
  phone: String,
  allergies: String,
  medications: String,
  otherInfo: String,
  diagnosis: String,
  patientId: {
    type: String,
    unique: true,
    required: true
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
