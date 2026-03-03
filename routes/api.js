const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const Session = require('../models/Sessions');

// POST: Need Assessment & Profile Creation
router.post('/assess', async (req, res) => {
  try {
    const user = await User.create(req.body); // Analyzes student profiles 
    const gap = (user.weakTopics && user.weakTopics[0]) || "General Foundation";
    
    const session = await Session.create({
      userId: user._id,
      aiAssessment: { detectedGap: gap, priority: 'High' }
    });
    
    res.status(201).json({ user, session });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;