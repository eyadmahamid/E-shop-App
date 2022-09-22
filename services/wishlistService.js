const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');


//  @desc Add product to wishlist 
// @route POST/api/v1/wishlist/:productId
// @access Protecded/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        // addToSet: add productId to wishlist array if productId not exist  
        
        $addToSet: {
            wishlist: req.body.productId
        },

    }, {
        new: true
    })
    res.status(200).json({
        status: 'Success,',
        message: 'Product added succeessfully to your wishlist',
        data: user.wishlist
    })
});

//  @desc remove product to wishlist 
// @route DELETE/api/v1/wishlist
// @access Protecded/User
exports.removeProductToWishlist = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        // $pull: remove productId from wishlist array if productId exist  
       
        $pull: {
            wishlist: req.params.productId
        },

    }, {
        new: true
    })
    res.status(200).json({
        status: 'Success,',
        message: 'Product removed succeessfully from your wishlist',
        data: user.wishlist
    })
});


//  @desc get products to wishlist 
// @route GET/api/v1/wishlist
// @access Protecded/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
        status: 'Success',
        results: user.wishlist.length,
        data: user.wishlist
    });

});