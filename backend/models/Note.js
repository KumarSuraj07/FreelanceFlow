const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  noteText: { type: String, required: true },
  nextSteps: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);