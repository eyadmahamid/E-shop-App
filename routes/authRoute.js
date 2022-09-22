const express = require('express');

const {
    signup,
    login,
    forgotPassword,
    verifyPassResetCode,
    resetPassword

} = require('../services/authService');
const {
    signupValidator,
    loginValidator
} = require('../utils/Validators/authValidator')

const router = express.Router();


router.route('/signup')
    .post(signupValidator, signup);

router.route('/login')
    .post(loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);



module.exports = router