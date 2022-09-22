 const User = require('../models/userModel');
 const factory = require('./handlerFactory');

 const bcrypt = require('bcryptjs');
 const asyncHandler = require('express-async-handler');
 const sharp = require('sharp');
 const {
     v4: uuidv4
 } = require('uuid');
 const {
     uploadSingleImg
 } = require('../middleware/uploadImageMiddleware');
 const ApiError = require('../utils/apiError');
 const createToken = require('../utils/createToken');
 exports.uploadUserImage = uploadSingleImg("profileImg");
 exports.resizeImage = asyncHandler(async (req, res, next) => {
     const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
     if (req.file) {
         await sharp(req.file.buffer).resize(240, 300).toFormat('jpeg')
             .jpeg({
                 quality: 90
             }).toFile(`uploads/users/${filename}`);
         req.body.profileImg = filename;


     }
     next();
 });


 // @desc    Get list of users
 // @route   GET /api/v1/users
 // @access  Private/Admin
 exports.getUsers = factory.getAll(User);

 // @desc    Get specific user by id
 // @route   GET /api/v1/users/:id
 // @access  Private/Admin
 exports.getUser = factory.getOne(User);

 // @desc    Create user
 // @route   POST  /api/v1/users
 // @access  Private/Admin
 exports.createUser = factory.createOne(User);

 // @desc    Update specific user
 // @route   PUT /api/v1/users/:id
 // @access  Private/Admin
 exports.updateUser = asyncHandler(async (req, res, next) => {
     const document = await User.findByIdAndUpdate(
         req.params.id, {
             name: req.body.name,
             slug: req.body.slug,
             email: req.body.email,
             phone: req.body.phone,
             profileImg: req.body.profileImg,
             role: req.body.role
         }, {
             new: true
         }
     );
     if (!document) {
         return next(new ApiError(`No document for this id ${req.params.id}`), 404)
     }
     res.status(200).json({
         data: document
     })
 });

 // admin we not generte a new new token because the admin can't change token..
 exports.changeUserPassword = asyncHandler(async (req, res, next) => {

     const document = await User.findByIdAndUpdate(
         req.params.id, {
             password: await bcrypt.hash(req.body.password, 12),
             passwordChangedAt: Date.now()
         }, {
             new: true,
         }
     );
     if (!document) {
         return next(new ApiError(`No document for this id ${req.param.id}`), 404);
     }
     res.status(200).json({
         data: document
     })
 })

 // @desc    Delete specific user
 // @route   DELETE /api/v1/users/:id
 // @access  Private/Admin
 exports.deleteUser = factory.deleteOne(User);



 // @desc    Get Logged user Data
 // @route   GET /api/v1/users/getMe
 // @access  Private/Protect
 exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
     req.params.id = req.user._id;
     next();
 })

 // @desc    update Logged user password
 // @route   PUT /api/v1/users/updateMyPassword
 // @access  Private/Protect
 exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {

     const user = await User.findByIdAndUpdate(
         req.user._id, {
             password: await bcrypt.hash(req.body.password, 12),
             passwordChangedAt: Date.now()
         }, {
             new: true
         });

     const token = createToken(user._id);

     res.status(200).json({
         data: user,
         token
     })
 });

 // @desc    update Logged user Data
 // @route   PUT /api/v1/users/updateMe
 // @access  Private/Protect
 exports.updataLoggedUserData = asyncHandler(async (req, res, next) => {
     const updateUser = await User.findByIdAndUpdate(req.user._id, {
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone
     }, {
         new: true
     })
     res.status(200).json({
         data: updateUser
     })
 });

 // @desc    Delete Logged user Data
 // @route   Delete /api/v1/users/deleteMe
 // @access  Private/Protect
 exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {

     await User.findByIdAndUpdate(req.user._id, {
         active: false
     })
     res.status(204).json({
         status: 'Success'
     });
 });


 exports.activeLoggedUserData = asyncHandler(async (req, res, next) => {
     await User.findByIdAndUpdate(req.user._id, {
         active: true
     });
     res.status(204).json({
         status: "Success"
     });
 });