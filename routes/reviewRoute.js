const express = require('express');

const {
    createReview,
    updateReview,
    getReview,
    getReviews,
    deleteReview,
    createFilterObj,
    setProductIdAndUserIdBody
} = require('../services/reviewService');
const {
    createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator
} = require('../utils/Validators/reviewValidator');
const router = express.Router({mergeParams:true});
const AuthService = require('../services/authService');

router.route('/')
    .post(AuthService.protect, AuthService.allowedTo('user'), setProductIdAndUserIdBody, createReviewValidator, createReview)
    .get(createFilterObj,getReviews);
    
router.route('/:id')
    .get(getReviewValidator,getReview)
    .put(AuthService.protect, AuthService.allowedTo('user'),updateReviewValidator ,updateReview)
    .delete(AuthService.protect, AuthService.allowedTo('admin', 'manager', 'user'),deleteReviewValidator ,deleteReview)


module.exports = router