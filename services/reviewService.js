const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');



// Nested Route (Create)
// POST /products/productId/reviews
exports.setProductIdAndUserIdBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
}

// Nexted Route
// GET /api/v1/products/productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = {
        product: req.params.productId
    }
    req.filterObj = filterObject;
    next();
}

// @desc    Get list of Reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get specific Review by id
// @route   GET /api/v1/review/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
exports.createReview = factory.createOne(Review);

// @desc    Update specific Review
// @route   PUT /api/v1/review/:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);