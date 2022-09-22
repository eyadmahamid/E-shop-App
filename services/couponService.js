const Coupon = require('../models/couponModel');
const factory = require('./handlerFactory');



// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin-manager
exports.getCoupons = factory.getAll(Coupon);

// @desc    Get specific coupn by id
// @route   GET /api/v1/coupon/:id
// @access   Private/Admin-manager
exports.getCoupon = factory.getOne(Coupon);

// @desc    Create coupon
// @route   POST  /api/v1/brands
// @access   Private/Admin-manager
exports.createCoupon = factory.createOne(Coupon);

// @desc    Update specific coupon
// @route   PUT /api/v1/brands/:id
// @access   Private/Admin-manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc    Delete specific Coupon
// @route   DELETE /api/v1/brands/:id
// @access   Private/Admin-manager
exports.deleteCoupon = factory.deleteOne(Coupon);