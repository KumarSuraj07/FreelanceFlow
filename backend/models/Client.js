const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  projectType: { type: String },
  budget: { type: Number },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Completed'], 
    default: 'Active' 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);