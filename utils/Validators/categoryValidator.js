
const {
    check,
    body
} = require('express-validator');
const { default: slugify } = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.createCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('Category required')
    .isLength({
        min: 3
    })
    .withMessage('Too short category name')
    .isLength({
        max: 32
    })
    .withMessage('Too long category name'),
    body('name').custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    body('name').custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];