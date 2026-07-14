// models/review.js
const mongoose = require('mongoose');





const PastorSchema = new mongoose.Schema({
  name: { type: String, default: 'Untitled Pastor' },
 role: { type: String, default: '' },
    message: { type: String, default: '' },
      image: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Pastors', PastorSchema);
