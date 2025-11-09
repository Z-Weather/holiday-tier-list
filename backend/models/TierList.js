const mongoose = require('mongoose');

const holidayItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['national', 'religious', 'cultural', 'seasonal', 'personal', 'other'],
    default: 'other'
  },
  date: {
    type: String,
    trim: true
  },
  emoji: {
    type: String,
    default: '🎉'
  }
});

const tierSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#f0f0f0'
  },
  items: [holidayItemSchema]
});

const tierListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  creator: {
    type: String,
    default: 'Anonymous'
  },
  tiers: [tierSchema],
  template: {
    type: String,
    enum: ['holidays', 'custom'],
    default: 'holidays'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  views: {
    type: Number,
    default: 0
  },
  stats: {
    totalLikes: {
      type: Number,
      default: 0
    },
    totalComments: {
      type: Number,
      default: 0
    },
    totalShares: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

tierListSchema.index({ creator: 1, createdAt: -1 });
tierListSchema.index({ title: 'text', description: 'text', tags: 'text' });
tierListSchema.index({ 'stats.totalLikes': -1 });
tierListSchema.index({ views: -1 });
tierListSchema.index({ createdAt: -1 });


module.exports = mongoose.model('TierList', tierListSchema);