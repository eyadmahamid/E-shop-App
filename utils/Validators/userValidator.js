const {
    check,
    body
} = require('express-validator');
const {
    default: slugify
} = require('slugify');
const bcrypt = require('bcryptjs');

const validatormiddleware = require('../../middleware/validatorMiddleware');
const User = require('../../models/userModel');



exports.createUserValidator = [
    check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({
        min: 3
    })
    .withMessage('Too short User name')
    .custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),

    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({
            email: val
        }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already in user'));
            }
        })
    ),

    check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({
        min: 6
    })
    .withMessage('Password must be at least 6 characters')
    .custom((password, {
        req
    }) => {
        if (password !== req.body.passwordConfirm) {
            throw new Error('Password Confirmation incorrect');
        }
        return true;
    }),

    check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

    check('phone')
    .optional()
    .isMobilePhone('he-IL')
    .withMessage('Invalid phone number only accepted IL Phone numbers'),

    check('profileImg').optional(),
    check('role').optional(),

    validatormiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage(`Invalid user id format`),

    validatormiddleware
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid user id format'),
    body('name').optional().custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({
            email: val
        }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already in user'));
            }
        })
    ),
    check('phone')
    .optional()
    .isMobilePhone('he-IL')
    .withMessage('Invalid phone number only accepted IL Phone numbers'),
    check('profileImg').optional(),
    check('role').optional(),

    validatormiddleware
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid user id format'),
    check('currentPassword').notEmpty().withMessage('You must enter your current Password'),
    body('passwordConfirm').notEmpty().withMessage('You must enter your Password Confirm '),
    body('password').notEmpty().withMessage('You must enter your Password')
    .custom(async (val, {
        req
    }) => {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('there is nn user for this id')
        }
        // bcrypt.compare(pass(hash),(hash))=> if(currentPassword == password)  Return Booelan 
        const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isCorrectPassword) {
            throw new Error('Incorrect current password');
        }
        if (val != req.body.passwordConfirm) {
            throw new Error('Password Confrim incorrect');
        }

        return true;
    }),

    validatormiddleware


]

exports.deleteUserValidator = [

    check('id').isMongoId().withMessage('Invalid user id format'),

    validatormiddleware
];

exports.updateLoggedUserValidator = [

    body('name').optional().custom((val, {
        req
    }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({
            email: val
        }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already in user'));
            }
        })
    ),
    check('phone')
    .optional()
    .isMobilePhone('he-IL')
    .withMessage('Invalid phone number only accepted IL Phone numbers'),
    check('profileImg').optional(),


    validatormiddleware
];