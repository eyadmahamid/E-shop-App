const crypto = require('crypto')


const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');
const {
    sanitizeUserSignup,sanitizeUserLogin
} = require('../utils/sanitizeData');

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1- Create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    const token = createToken(user._id);
    res.status(201).json({
        data: sanitizeUserSignup(user),
        token
    });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    const token = createToken(user._id);


    res.status(200).json({
        data:sanitizeUserLogin(user),
        token
    })
})



// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {

    // 1) Check if token exist, if exist get
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new ApiError(
                'You are not login, Please login to get access this route',
                401
            )
        );
    }

    // 2) Verify token (no change happens, expired token)
    // בודקים האם token שיך ל id שנמצא ב data
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user exists
    // בודקים אם id נמצא או נמחק מ data
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new ApiError(
                'The user that belong to this token does no longer exist',
                401
            )
        );
    }

    // Password Change after token createrd 
    if (currentUser.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000, 10
        );
        if (passwordChangedTimestamp > decoded.iat) {
            return next(new ApiError('user recntly his password, Plesae login again..', 401));
        }
    }

    req.user = currentUser;
    next();
})


// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        // 1)access roles
        // 2)access registered user(req.user.role) 
        if (!roles.includes(req.user.role)) {
            return next(new ApiError('you are not allowed to access this route', 403));
        }
        next();
    });

// @desc    forgot password
// @route   POST/api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1)Get user by email
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return next(new ApiError(`You are not user with that email ${req.body.email}`), 404)
    }
    //2) if user exist, Generate 'hash' random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256')
        .update(resetCode)
        .digest('hex');
    // save hashed password in db
    user.passwordRestCode = hashedResetCode;
    // Add expiration time for Password rest Code (10 min)      
    user.passwordRestExpires = Date.now() + 10 * 60 * 1000;

    user.passwordRestVerified = false;

    await user.save();

    // 3) Send the reset code via email
    const message = `Hi ${user.name},\n We received a request to reset the password on your  E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min)',
            message,
        });
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(new ApiError('There is an error in sending email', 500));
    }

    res
        .status(200)
        .json({
            status: 'Success',
            message: 'Reset code sent to email'
        });
});


// @desc    Verify Password Reset Code 
// @route   POST/api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {

    const hashedResetCode = crypto.createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');
    const user = await User.findOne({
        passwordRestCode: hashedResetCode,
        passwordRestExpires: {
            $gt: Date.now()
        } //$gt גדול מ
    })
    if (!user) {
        return next(new ApiError('Reset Code invalid or expired', 404));
    }

    //  Reset Code invalid
    user.passwordRestVerified = true;
    await user.save();

    res.status(200).json({
        status: 'success'
    });
});


exports.resetPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        return next(new ApiError(`There is no user With this email:${req.body.email}`, 404));

    }
    if (!user.passwordRestVerified) {
        return next(new ApiError('Reset Code not Verified', 400))
    }

    user.password = req.body.newPassword;
    user.passwordRestExpires = undefined;
    user.passwordRestCode = undefined;
    user.passwordRestVerified = undefined;

    await user.save();


    const token = createToken(user._id)

    res.status(200).json({
        token
    })
});