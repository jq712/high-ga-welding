const AllowedEmail = require('../models/AllowedEmail');
const { AppError } = require('../middleware/errorHandler');

exports.addAllowedEmail = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const allowedEmail = await AllowedEmail.create({ email, role });
    res.status(201).json({
      status: 'success',
      data: { allowedEmail }
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Email already allowed', 400));
    }
    next(error);
  }
};

exports.getAllowedEmailsPage = async (req, res, next) => {
  try {
    const allowedEmails = await AllowedEmail.find().sort({ addedAt: -1 });
    console.log('Fetched emails with dates:', allowedEmails.map(email => ({
      email: email.email,
      addedAt: email.addedAt
    })));
    
    res.render('allowed-emails', {
      allowedEmails,
      currentPage: 'allowed-emails'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllowedEmails = async (req, res, next) => {
  try {
    const allowedEmails = await AllowedEmail.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { allowedEmails }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAllowedEmail = async (req, res, next) => {
  try {
    const allowedEmail = await AllowedEmail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ status: 'success', data: { allowedEmail } });
  } catch (error) {
    next(error);
  }
};

exports.deleteAllowedEmail = async (req, res, next) => {
  try {
    const allowedEmail = await AllowedEmail.findByIdAndDelete(req.params.id);
    if (!allowedEmail) {
      return next(new AppError('No allowed email found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 