const {
    check,
    body
} = require('express-validator');
const {
    default: slugify
} = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware
];
exports.createSubCategoryValidator = [check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({
        min: 2
    })
    .withMessage("to short category name")
    .isLength({
        max: 32
    })
    .withMessage("to long category name"),
    check("category")
    .isMongoId()
    .withMessage("category must to belong to category"),
    body('name').custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
];
exports.updateSubCategoryValidator = [check("id")
    .isMongoId()
    .withMessage("Invalid categoy id format"),
    check('name').notEmpty()
    .withMessage("category required"),
    body('name').custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
];
exports.deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware
];