const express = require('express');

const {
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    uploadUserImage,
    resizeImage,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updataLoggedUserData,
    deleteLoggedUserData


} = require('../services/userService');
const {
    createUserValidator,
    updateUserValidator,
    getUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator
} = require('../utils/Validators/userValidator')

const AuthService = require('../services/authService');

const router = express.Router();

router.use(AuthService.protect)

 // user
router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updataLoggedUserData)
router.delete('/deleteMe', deleteLoggedUserData);



// Admin
router.use(AuthService.allowedTo('admin'));

router.put("/changePassword/:id", changeUserPasswordValidator, changeUserPassword);
router.route('/')
    .post(uploadUserImage, resizeImage, createUserValidator, createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser)





module.exports = router