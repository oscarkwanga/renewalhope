// models/review.js
const mongoose = require('mongoose');





const EventSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Event' },
 date: { type: Date, default: Date.now },
 time: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Events', EventSchema);
