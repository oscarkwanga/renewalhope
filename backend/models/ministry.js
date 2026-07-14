// models/review.js
const mongoose = require('mongoose');





const MinistrySchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Ministry' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Ministries', MinistrySchema);
