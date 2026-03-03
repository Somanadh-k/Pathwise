const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiAssessment: {
    detectedGap: String,
    priority: { type: String, enum: ['High', 'Medium', 'Low'] }
  },
  feedback: {
    status: String, // e.g., "too slow" [cite: 32]
    adjustmentMade: Boolean
  },
  testScores: [{ topic: String, score: Number }] // Performance tracking [cite: 22, 53]
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);