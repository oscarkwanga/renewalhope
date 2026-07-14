// models/review.js
const mongoose = require('mongoose');





const SermonSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Sermon' },
  slug: { type: String, default: '' },
  speaker: { type: String, default: '' },
  date: { type: String, default: '' },
  readingTime: { type: String, default: '' },
  image: { type: String, default: '' },
  introduction: { type: String, default: '' },
  sections: [{ title: String, content: String }],
  scripture: { type: String, default: '' },
  keyVerse: { type: String, default: '' },
  quote: { type: String, default: '' },
 
  prayer: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Sermons', SermonSchema);
