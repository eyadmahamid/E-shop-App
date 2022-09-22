const express = require('express');

const {
    createBrand,
    getBrands,
    getBrand,
    deleteBrand,
    updateBrand,
    uploadBrandImage,
    resizeImage

} = require('../services/brandService');
const {
    createBrandValidator,
    updateBrandValidator,
    getBrandValidator,
    deleteBrandValidator
} = require('../utils/Validators/brandValidator')

const router = express.Router();
const AuthService = require('../services/authService');

router.route('/')
    .post(AuthService.protect, AuthService.allowedTo('admin', 'manager'), uploadBrandImage, resizeImage, createBrandValidator, createBrand)
    .get(getBrands);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(AuthService.protect, AuthService.allowedTo('admin', 'manager'), uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(AuthService.protect, AuthService.allowedTo('admin'), deleteBrandValidator, deleteBrand)


module.exports = router