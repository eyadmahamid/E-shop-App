const {
    check,
    body
} = require('express-validator');
const Review = require('../../models/reviewModel');
const validatormiddleware = require('../../middleware/validatorMiddleware');


exports.createReviewValidator = [

    check('title').optional(),
    check('ratings').notEmpty().withMessage('ratings value is required')
    .isFloat({
        min: 1,
        max: 5
    }).withMessage('ratings value must be between 1 to 5'),
    check('user').isMongoId().withMessage('Invalid Review id format'),
    check('product').isMongoId().withMessage('Invalid Review id Format').custom((val, {
            req
        }) =>
        Review.findOne({
            user: req.user._id,
            product: req.body.product
        }).then(
            (review) => {
                if (review) {
                    return Promise.reject(new Error('You already Created a Review before'));
                }
            }
        )
    ),


    validatormiddleware
];

exports.getReviewValidator = [
    check('id').isMongoId().withMessage(`Invalid review id format`),

    validatormiddleware
];

exports.updateReviewValidator = [
    check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, {
            req
        }) =>
        // Check review ownership before update
        Review.findById(val).then((review) => {
            if (!review) {
                return Promise.reject(new Error(`There is no review with id ${val}`));
            }

            if (review.user._id.toString() != req.user._id.toString()) {
                return Promise.reject(
                    new Error(`Your are not allowed to perform this action`)
                );
            }
        })
    ),
    validatormiddleware
];

exports.deleteReviewValidator = [

    check('id').isMongoId().withMessage('Invalid review id format')
    .custom((val, {
        req
    }) => {
        if (req.user.role == 'user') {
            return Review.findById(val).then((review) => {
                if (!review) {
                    return Promise.reject(new Error(`There is no review with id ${val}`));
                }
                if (review.user._id.toString() != req.user._id.toString()) {
                    return Promise.reject(new Error(`You are not allowed to perform this action`))
                }
            });
        }
        return true;
    }), validatormiddleware
];