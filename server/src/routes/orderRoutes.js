const express = require('express');
const router = express.Router();
const { 
  placeOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, placeOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/all', authenticate, isAdmin, getAllOrders);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);

module.exports = router;
