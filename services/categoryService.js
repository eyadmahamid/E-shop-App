const Category = require('../models/CategoryModel');
const factory = require('./handlerFactory');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const {
    v4: uuidv4
} = require('uuid');

const {
    uploadSingleImg
} = require('../middleware/uploadImageMiddleware');


// DiskStorage engine
// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/categories');
//         // מיצר קובץ uplaods בתוכו קובץ categories שינוסיף כל התמונות השיכות 
//     },
//     filename: function (req, file, cb) {
//         // file.mimetype:images/[jpeg];
//         const ext = file.mimetype.split('/')[1];
//         // שם קובץ של התמונה
//         // category-${id}-Date.now().jpeg
//         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//         cb(null, filename);
//     }
// });

// אחרי שהוספנן תמונה משנים את הפרטים גודל,שם,וכו
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg')
        .jpeg({
            quality: 90
        }).toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
    next();


});

exports.uploadCategoryImage = uploadSingleImg("image");





// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Manager
exports.createCategory = factory.createOne(Category);


//  בדיקה אמת או שקר asyncHandler(async)==>(שקר) express erro handle 
// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);


// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = factory.deleteOne(Category);