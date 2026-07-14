// models/review.js
const mongoose = require('mongoose');





const CultureSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Story' },
 text: { type: String, default: '' },
    image: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Cultures', CultureSchema);
