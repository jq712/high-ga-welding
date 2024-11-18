const Image = require('../models/Image');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs').promises;
const path = require('path');

// Display all images in gallery view
exports.renderGallery = async (req, res, next) => {
    try {
        // Get all images, newest first
        const images = await Image.find()
            .select('_id filename description category path uploadedAt')
            .sort({ uploadedAt: -1 })
            .lean();

        // Format dates and prepare images for display
        const formattedImages = images.map(image => ({
            ...image,
            uploadedAt: new Date(image.uploadedAt).toLocaleDateString()
        }));

        // Check if we're in admin view
        const isAdmin = req.path.includes('management');
        const viewName = isAdmin ? 'gallery-management' : 'gallery';
        
        res.render(viewName, {
            images: formattedImages,
            currentPage: viewName,
            user: isAdmin ? req.session.user : null
        });
    } catch (error) {
        next(new AppError('Failed to load gallery', 500));
    }
};

// Remove image from storage and database
exports.deleteImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return next(new AppError('Image not found', 404));
        }

        // Try to delete the actual image file
        const filePath = path.join(__dirname, '..', 'public', image.path);
        await fs.unlink(filePath).catch(err => console.error('File deletion failed:', err));

        // Remove from database
        await Image.findByIdAndDelete(req.params.id);
        
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete image', 500));
    }
};

// Update image details
exports.updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, description } = req.body;

        const image = await Image.findByIdAndUpdate(
            id,
            { category, description },
            { new: true }
        );

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json({ data: image });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update image' });
    }
};

// Save new image with details
exports.createImage = async (req, res, next) => {
    try {
        // Check for required data
        if (!req.file) {
            return next(new AppError('No image uploaded', 400));
        }
        if (!req.body.description || !req.body.category) {
            return next(new AppError('Missing description or category', 400));
        }

        // Save image details to database
        const image = await Image.create({
            filename: req.file.filename,
            description: req.body.description,
            category: req.body.category,
            path: `/uploads/${req.file.filename}`,
            uploadedAt: new Date()
        });

        res.status(201).json({ data: image });
    } catch (error) {
        next(new AppError('Failed to save image', 500));
    }
};
