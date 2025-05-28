const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, deleteCoupon, checkCoupon } = require('../controllers/couponController');

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.delete('/:id', deleteCoupon);

// NEW: Check coupon validity
router.post('/check', checkCoupon);

module.exports = router;
