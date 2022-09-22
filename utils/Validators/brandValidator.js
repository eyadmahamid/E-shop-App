const {
    check,body
} = require('express-validator');
const {
    default: slugify
} = require('slugify');
const validatormiddleware = require('../../middleware/validatorMiddleware');


exports.createBrandValidator = [

    check('name').notEmpty().withMessage('brand name is required')
    .isLength({
        min: 2
    }).withMessage('to short brand name')
    .isLength({
        max: 32
    }).withMessage('to long brand name'),
    body('name').custom((val,{req})=>{
        req.body.slug=  slugify(val);
        return true;
    }),
    validatormiddleware
];

exports.getBrandValidator = [
    check('id').isMongoId().withMessage(`Invalid brand id format`),

    validatormiddleware
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    body('name').optional().custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatormiddleware
];

exports.deleteBrandValidator = [

    check('id').isMongoId().withMessage('Invalid brand id format'),

    validatormiddleware
];