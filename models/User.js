const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  grade: { type: Number, default: 10 }, // Target: Class 10 CBSE [cite: 30, 35]
  learningStyle: { type: String, enum: ['video', 'text', 'interactive'], default: 'video' },
  weakTopics: [String], // Need Assessment [cite: 17]
  goal: String, // Intent Detection [cite: 16]
  currentLevel: { type: String, default: 'Beginner' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);