const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    }
});

// Create multer upload middleware
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = {
    uploadSingle: upload.single('image'),
    uploadMultiple: upload.array('images', 5),
    cloudinary
}; 