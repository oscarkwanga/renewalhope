// models/review.js
const mongoose = require('mongoose');





const MilestoneSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Milestone' },
 year: { type: String, default: '' },
    description: { type: String, default: '' },
      image: { type: String, default: '' },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Milestones', MilestoneSchema);
