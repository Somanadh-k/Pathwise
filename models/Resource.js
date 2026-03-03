const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: String,
  subject: String,
  topic: String,
  type: { type: String, enum: ['video', 'text', 'interactive'] },
  url: String,
  difficulty: { type: String, enum: ['Beginner', 'Medium', 'Medium-High', 'Advanced'] }
});

module.exports = mongoose.model('Resource', ResourceSchema);