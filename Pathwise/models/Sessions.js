const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiAssessment: {
    detectedGap: String,
    priority: String
  },
  feedback: {
    status: String,
    adjustmentMade: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);