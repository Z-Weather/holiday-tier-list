const express = require('express');
const { body, validationResult, query } = require('express-validator');
const TierList = require('../models/TierList');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'views']),
  query('search').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || 'newest';
    const search = req.query.search;

    let query = { isPublic: true };
    let sortOptions = {};

    if (search) {
      query.$text = { $search: search };
    }

    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { 'stats.totalLikes': -1, createdAt: -1 };
        break;
      case 'views':
        sortOptions = { views: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const tierLists = await TierList.find(query)
      .populate('creator', 'username avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await TierList.countDocuments(query);

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
    console.error('Get tier lists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tierList = await TierList.findById(req.params.id)
      .populate('creator', 'username avatar bio stats');

    if (!tierList) {
      return res.status(404).json({ message: 'Tier list not found' });
    }

    tierList.views += 1;
    await tierList.save();

    res.json(tierList);
  } catch (error) {
    console.error('Get tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('tiers').isArray().withMessage('Tiers must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tiers, tags, isPublic, template } = req.body;

    const tierList = new TierList({
      title,
      description,
      creator: req.user._id,
      tiers,
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      template: template || 'holidays'
    });

    await tierList.save();
    await tierList.populate('creator', 'username avatar');

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.tierListsCreated': 1 }
    });

    res.status(201).json(tierList);
  } catch (error) {
    console.error('Create tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('tiers').optional().isArray().withMessage('Tiers must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tierList = await TierList.findById(req.params.id);

    if (!tierList) {
      return res.status(404).json({ message: 'Tier list not found' });
    }

    if (tierList.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this tier list' });
    }

    const { title, description, tiers, tags, isPublic } = req.body;

    if (title !== undefined) tierList.title = title;
    if (description !== undefined) tierList.description = description;
    if (tiers !== undefined) tierList.tiers = tiers;
    if (tags !== undefined) tierList.tags = tags;
    if (isPublic !== undefined) tierList.isPublic = isPublic;

    await tierList.save();
    await tierList.populate('creator', 'username avatar');

    res.json(tierList);
  } catch (error) {
    console.error('Update tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const tierList = await TierList.findById(req.params.id);

    if (!tierList) {
      return res.status(404).json({ message: 'Tier list not found' });
    }

    if (tierList.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this tier list' });
    }

    await TierList.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.tierListsCreated': -1 }
    });

    res.json({ message: 'Tier list deleted successfully' });
  } catch (error) {
    console.error('Delete tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const tierList = await TierList.findById(req.params.id);

    if (!tierList) {
      return res.status(404).json({ message: 'Tier list not found' });
    }

    const liked = tierList.toggleLike(req.user._id);
    await tierList.save();

    res.json({
      liked,
      totalLikes: tierList.stats.totalLikes
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tierLists = await TierList.find({
      creator: userId,
      isPublic: true
    })
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await TierList.countDocuments({
      creator: userId,
      isPublic: true
    });

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
    console.error('Get user tier lists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;