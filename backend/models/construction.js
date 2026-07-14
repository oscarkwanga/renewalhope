// models/review.js
const mongoose = require('mongoose');





const ConstructionSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Story' },
    image: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Constructions', ConstructionSchema);
