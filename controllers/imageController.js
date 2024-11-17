const Image = require('../models/Image');
const { AppError } = require('../middleware/errorHandler');

exports.getAllImages = async (req, res, next) => {
    try {
        const images = await Image.find().select('-__v');
        res.status(200).json({
            status: 'success',
            data: images
        });
    } catch (error) {
        console.error('Gallery fetch error:', error);
        next(new AppError('Failed to load images', 500));
    }
};

// Add additional image-related controller methods
exports.deleteImage = async (req, res, next) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        if (!image) {
            return next(new AppError('No image found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(new AppError('Failed to delete image', 500));
    }
};

exports.updateImage = async (req, res, next) => {
    try {
        const { description, category } = req.body;
        
        const image = await Image.findByIdAndUpdate(
            req.params.id,
            { description, category },
            { new: true, runValidators: true }
        );

        if (!image) {
            return next(new AppError('No image found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: image
        });
    } catch (error) {
        next(new AppError('Failed to update image', 500));
    }
};

exports.createImage = async (req, res, next) => {
    try {
        const { filename, description, category, path } = req.body;
        
        const image = await Image.create({
            filename,
            description,
            category,
            path,
            uploadedAt: new Date()
        });

        res.status(201).json({
            status: 'success',
            data: image
        });
    } catch (error) {
        next(new AppError('Failed to create image', 500));
    }
}; 