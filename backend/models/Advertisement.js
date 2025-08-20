const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'condo', 'room', 'vacation-rental', 'commercial']
  },
  images: [{
    type: String, // URLs to uploaded images
    required: false
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  contactInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
advertisementSchema.index({ title: 'text', description: 'text', location: 'text' });
advertisementSchema.index({ category: 1, price: 1, location: 1 });

module.exports = mongoose.model('Advertisement', advertisementSchema);