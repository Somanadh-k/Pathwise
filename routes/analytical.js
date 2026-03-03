const express = require('express');
const router = express.Router();
const Session = require('../models/Sessions'); // Matches your file: Sessions.js

// Analytics Endpoint for Real-time Visualization
router.get('/stats', async (req, res) => {
  try {
    const stats = await Session.aggregate([
      { $group: { _id: "$aiAssessment.detectedGap", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics data" });
  }
});

module.exports = router;