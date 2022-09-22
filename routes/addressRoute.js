const express = require('express');

const {

    addAddress,
    removeAddress,
    getLoggedUserAddresses
} = require('../services/addressService');
const AuthService = require('../services/authService');
const router = express.Router();
router.use(AuthService.protect, AuthService.allowedTo('user'))


router.route('/')
    .post(addAddress).get(getLoggedUserAddresses)
router.delete('/:addressId', removeAddress);

module.exports = router