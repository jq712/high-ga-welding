const Image = require("../models/Image");

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
    const images = await Image.find({}).sort({ uploadedAt: -1 });
    res.render('gallery-management', {
      user: req.session.user,
      images: images
    });
  } catch (error) {
    next(error);
  }
};