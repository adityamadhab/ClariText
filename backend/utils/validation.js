const { body } = require('express-validator');

const registerValidation = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const postValidation = [
    body('title')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long')
        .trim(),
    body('content')
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long')
];

const commentValidation = [
    body('content')
        .isLength({ min: 1 })
        .withMessage('Comment cannot be empty')
        .trim()
];

module.exports = {
    registerValidation,
    postValidation,
    commentValidation
}; 