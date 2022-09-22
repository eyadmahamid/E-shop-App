const express = require('express');

const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    uploadProductsImages,
    resizeProductImages,

} = require('../services/productService');
const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/Validators/productValidator');

const AuthService = require('../services/authService');
const reviewsRoute = require('../routes/reviewRoute');
const router = express.Router();

// POST /products/productId/reviews
// GET /products/productId/reviews
// GET /products/productId/reviews/reviewsId    
router.use('/:productId/reviews', reviewsRoute);

router.route('/')
    .post(AuthService.protect, AuthService.allowedTo('admin', 'manager'), uploadProductsImages, resizeProductImages, createProductValidator, createProduct).get(getProducts);

router.route('/:id').get(getProductValidator, getProduct)
    .put(AuthService.protect, AuthService.allowedTo('admin', 'manager'), uploadProductsImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(AuthService.protect, AuthService.allowedTo('admin'), deleteProductValidator, deleteProduct)



module.exports = router;