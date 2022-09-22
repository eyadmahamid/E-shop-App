const express = require('express');

const {
    createCashOrder,
    findAllOrders,
    filterOrderForLoggedUser,
    findSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkoutSession

} = require('../services/orderService');

const router = express.Router();
const AuthService = require('../services/authService');
router.use(AuthService.protect)
router.get(
    '/checkout-session/:cartId',
    AuthService.allowedTo('user'),
    checkoutSession
);
router.route('/:cartId').post(createCashOrder)
router.get('/', AuthService.allowedTo('user', 'admin', 'manager'), filterOrderForLoggedUser, findAllOrders);
router.get('/:id', findSpecificOrder);
router.put('/:id/pay', AuthService.allowedTo('admin', 'manager'), updateOrderToPaid);
router.put('/:id/deliver', AuthService.allowedTo('admin', 'manager'), updateOrderToDelivered)
module.exports = router