const router = require('express').Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Create comment
router.post('/', auth, async (req, res) => {
    try {
        const { content, postId, parentCommentId } = req.body;
        const newComment = new Comment({
            content,
            post: postId,
            author: req.user.id,
            parentComment: parentCommentId || null
        });

        const savedComment = await newComment.save();
        await savedComment.populate('author', 'username');
        res.json(savedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        comment.content = req.body.content;
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like/Unlike comment
router.put('/like/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const likeIndex = comment.likes.indexOf(req.user.id);
        if (likeIndex === -1) {
            comment.likes.push(req.user.id);
        } else {
            comment.likes.splice(likeIndex, 1);
        }

        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 