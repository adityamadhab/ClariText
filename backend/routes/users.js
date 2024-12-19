const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email, bio, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (bio) user.bio = bio;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's posts
router.get('/posts/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ 
            author: req.params.userId,
            status: 'published'
        })
        .populate('author', 'username')
        .sort({ createdAt: -1 });
        
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload profile picture
router.post('/profile-picture', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Note: Implement actual file upload logic here using multer and cloudinary
        const imageUrl = req.body.imageUrl;
        user.profilePicture = imageUrl;
        await user.save();

        res.json({ message: 'Profile picture updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 