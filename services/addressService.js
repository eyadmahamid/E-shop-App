const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');


// @dec Add address to user addrress list 
// @route POST/api/v1/address
// @access Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
            addresses: req.body
        }
    }, {
        new: true
    });

    res.status(200).json({
        status: 'Success',
        message: 'Address add successfully.',
        data: user.addresses
    })

});


// @dec remove address for user address list
// @Route DELETE/api/v1/address/:addressId
// @access Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {
            addresses: {
                _id: req.params.addressId
            }
        }
    })

    res.status(200).json({
        status: 'success',
        message: 'address removed successfully. ',
        data: user.addresses,
    })
});


// @dec get Logged user addresses list
// @Route GET/api/v1/address
// @access Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id).populate('addresses');
    res.status(200).json({
        status: 'success',
        results: user.addresses.length,
        data: user.addresses
    })
});