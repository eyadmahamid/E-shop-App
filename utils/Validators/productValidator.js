const {
    check,
    body
} = require('express-validator');

const validatormiddleware = require('../../middleware/validatorMiddleware');
const Category = require('../../models/CategoryModel');
const SubCategory = require('../../models/SubCategoryModel');
const slugify = require('slugify');

exports.createProductValidator = [
    check('title').notEmpty().withMessage('Product required')
    .isLength({
        min: 2
    }).withMessage('must be least 2 chars'),
    check('description').notEmpty().withMessage('description required')
    .isLength({
        max: 2000
    }).withMessage('too Long description'),
    body('title').custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('quantity').notEmpty().withMessage('Product quantity is required')
    .isNumeric().withMessage('Product quantity must be a number'),
    check('sold').optional().isNumeric().withMessage('Product quantity must be a number'),
    check('price').notEmpty().withMessage('Product price is required')
    .isNumeric().withMessage('Product price must be a number')
    .isLength({
        max: 32
    }).withMessage('to long Price'),
    check('priceAfterDiscount').optional().isNumeric().withMessage('Product PriceDiscount must be a number')
    .toFloat()
    .custom((value, {
        req
    }) => {
        if (req.body.price <= value) {
            throw new Error('ProductAfterDiscount must be lower than normal Price');
        }
        return true;
    }),

    check('colors').optional().isArray().withMessage('colors should be array of String'),
    check('imageCover').notEmpty().withMessage('Product image Cover is required'),
    check('images').optional().isArray().withMessage('Product should be array string'),
    check('category').isMongoId().withMessage('Invalid Id Format')
    .custom((categoryId) =>
        Category.findById(categoryId).then((category) => {
            if (!category) {
                return Promise.reject(new Error(`No category for this id : ${categoryId}`));
            }
        })),
    check('subcategories').optional().isArray().isMongoId().withMessage('Invalid Id Format').custom((subcategoriesId) =>
        //   we git all the id of the db and check for the subcategoriesId and return the subacategories.
        SubCategory.find({
            _id: {
                $exists: true,
                $in: subcategoriesId
            }
        }).then((result) => {

            if (result.length < 1 || result.length !== subcategoriesId.length) {
                return Promise.reject(new Error(`Invalid subcategories Ids`));
            }
        })).custom((val, {
            req
        }) => SubCategory.find({
            category: req.body.category
        }).then((subcategories) => {
                const subCategoriesInDB = [];
                subcategories.forEach((subCategory) => {
                    subCategoriesInDB.push(subCategory._id.toString());

                });
                // check if subcategories ids in db inculde subcategories in req.body (return:true || false)
                const checkr = (target, arr) => target.every((v) => arr.includes(v))
                if (!checkr(val, subCategoriesInDB)) {
                    return Promise.reject(new Error(`subcategories not belong to category `));
                }


            }

        )

    ),
    check('brand').optional().isMongoId('Invalidn ID Format'),
    check('ratingsAverage').optional().isNumeric().withMessage('ratingsAverage must be a number')
    .isLength({
        min: 1
    }).withMessage('Rating must be above or equal 1.0')
    .isLength({
        max: 5
    }).withMessage('Rating must be below or equal 5.0'),
    check('ratingsQuantity').optional().isNumeric().withMessage('ratings Quantity must be a number'),

    validatormiddleware
];


exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id formate'),
    validatormiddleware,
];


exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id formate'),
    body('title').optional().custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatormiddleware,
];
exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id Formate'),
    validatormiddleware
];