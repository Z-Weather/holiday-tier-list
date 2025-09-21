const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const TierList = require('../models/TierList');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/tier-list/:tierListId', async (req, res) => {
  try {
    const { tierListId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      tierList: tierListId,
      parentComment: null
    })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({
      tierList: tierListId,
      parentComment: null
    });

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
  body('tierList').isMongoId().withMessage('Valid tier list ID required'),
  body('parentComment').optional().isMongoId().withMessage('Valid parent comment ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, tierList, parentComment } = req.body;

    const tierListExists = await TierList.findById(tierList);
    if (!tierListExists) {
      return res.status(404).json({ message: 'Tier list not found' });
    }

    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      tierList,
      parentComment: parentComment || null
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    await TierList.findByIdAndUpdate(tierList, {
      $inc: { 'stats.totalComments': 1 }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    await TierList.findByIdAndUpdate(comment.tierList, {
      $inc: { 'stats.totalComments': -1 }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const liked = comment.toggleLike(req.user._id);
    await comment.save();

    res.json({
      liked,
      totalLikes: comment.totalLikes
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;