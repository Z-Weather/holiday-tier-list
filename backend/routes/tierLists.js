const express = require('express');
const { body, validationResult, query } = require('express-validator');
const TierList = require('../models/TierList');

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
    const tierList = await TierList.findById(req.params.id);

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

router.post('/', [
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

    const { title, description, tiers, tags, isPublic, template, creator } = req.body;

    const tierList = new TierList({
      title,
      description,
      creator: creator || 'Anonymous',
      tiers,
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      template: template || 'holidays'
    });

    await tierList.save();

    res.status(201).json(tierList);
  } catch (error) {
    console.error('Create tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', [
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

    const { title, description, tiers, tags, isPublic } = req.body;

    if (title !== undefined) tierList.title = title;
    if (description !== undefined) tierList.description = description;
    if (tiers !== undefined) tierList.tiers = tiers;
    if (tags !== undefined) tierList.tags = tags;
    if (isPublic !== undefined) tierList.isPublic = isPublic;

    await tierList.save();

    res.json(tierList);
  } catch (error) {
    console.error('Update tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tierList = await TierList.findById(req.params.id);

    if (!tierList) {
      return res.status(404).json({ message: 'Tier list not found' });
    }

    await TierList.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tier list deleted successfully' });
  } catch (error) {
    console.error('Delete tier list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;