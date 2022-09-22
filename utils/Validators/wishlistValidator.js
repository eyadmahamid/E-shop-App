const {
    check,
    body
} = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Product = require('../../models/productModel');


exports.createWishlistValidtor = [
    check('productId').notEmpty().withMessage('Please enter the Product Id'),
    check('productId').isMongoId().withMessage('Invalid Id Format')
    .custom((productId) =>
        Product.findById(productId).then((product) => {
            if (!product) {
                return Promise.reject(new Error(`No Product for this id : ${productId}`));
            }
        })), validatorMiddleware
]

exports.deleteWishlistValidtor = [

    check('productId').isMongoId().withMessage('Invalid Id Format')
    .custom((productId) =>
        Product.findById(productId).then((product) => {
            if (!product) {
                return Promise.reject(new Error(`No Product for this id : ${productId}`));
            }
        })), validatorMiddleware
]
