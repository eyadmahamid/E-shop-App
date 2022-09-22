const multer = require('multer');
const ApiError = require('../utils/apiError');


const multerOptions = () => {
    // Use MemoryStorage  engine
    const multerStorage = multer.memoryStorage();
    // תנאי שאם מקבלים קובץ לא תמונה מחזיר false
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Only Images allowed'), 400);
        }
    }
    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });
    return upload;
}


exports.uploadSingleImg = (fileName) => multerOptions().single(fileName);

exports.uploadMixOfImages = (arrayOfFeildes) => multerOptions().fields(arrayOfFeildes);