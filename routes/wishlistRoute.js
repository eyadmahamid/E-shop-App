const express = require('express');

const {

    addProductToWishlist,
    removeProductToWishlist,
    getLoggedUserWishlist
} = require('../services/wishlistService');
const AuthService = require('../services/authService');
const { createWishlistValidtor,deleteWishlistValidtor} = require('../utils/Validators/wishlistValidator');
const router = express.Router();
router.use(AuthService.protect, AuthService.allowedTo('user'))


router.route('/')
    .post(createWishlistValidtor, addProductToWishlist).get(getLoggedUserWishlist)
router.delete('/:productId', deleteWishlistValidtor, removeProductToWishlist);

module.exports = router