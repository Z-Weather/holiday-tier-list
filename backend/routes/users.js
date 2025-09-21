const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const TierList = require('../models/TierList');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const publicProfile = {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      stats: user.stats,
      createdAt: user.createdAt
    };

    const tierListsCount = await TierList.countDocuments({
      creator: user._id,
      isPublic: true
    });

    res.json({
      ...publicProfile,
      tierListsCount
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, [
  body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('preferences.theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
  body('preferences.publicProfile').optional().isBoolean().withMessage('publicProfile must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, bio, avatar, preferences } = req.body;
    const user = req.user;

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    if (preferences) {
      if (preferences.theme) user.preferences.theme = preferences.theme;
      if (preferences.publicProfile !== undefined) {
        user.preferences.publicProfile = preferences.publicProfile;
      }
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        preferences: user.preferences,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-tier-lists', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tierLists = await TierList.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await TierList.countDocuments({ creator: req.user._id });

    res.json({
      tierLists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my tier lists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ],
      'preferences.publicProfile': true
    })
      .select('username avatar bio stats')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ],
      'preferences.publicProfile': true
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;