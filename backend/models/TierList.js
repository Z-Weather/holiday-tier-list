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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
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

tierListSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());

  if (existingLike) {
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
    this.stats.totalLikes = Math.max(0, this.stats.totalLikes - 1);
    return false;
  } else {
    this.likes.push({ user: userId });
    this.stats.totalLikes += 1;
    return true;
  }
};

module.exports = mongoose.model('TierList', tierListSchema);