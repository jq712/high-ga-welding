const Image = require("../models/Image");

// Add utility function at the top
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

exports.getDashboard = async (req, res, next) => {
  try {
    const images = await Image.find({}).sort({ uploadedAt: -1 });
    res.render('dashboard', {
      user: req.session.user,
      images: images
    });
  } catch (error) {
    next(error);
  }
};

exports.getGalleryManagement = async (req, res, next) => {
  try {
    // Get images from database with proper sorting
    const images = await Image.find()
      .select('_id filename description category path uploadedAt')
      .sort({ uploadedAt: -1 })
      .lean();  // Use lean() for better performance with SSR
    
    // Transform the data for template consumption
    const transformedImages = images.map(image => ({
      _id: image._id,
      path: image.path,
      category: image.category,
      description: image.description,
      uploadedAt: new Date(image.uploadedAt).toLocaleDateString()
    }));

    // Render the page with images
    res.render('gallery-management', {
      user: req.session.user,
      images: transformedImages,
      currentPage: 'gallery-management'
    });
  } catch (error) {
    next(error);
  }
};