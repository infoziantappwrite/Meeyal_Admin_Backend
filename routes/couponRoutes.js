const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, deleteCoupon } = require('../controllers/couponController');

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.delete('/:id', deleteCoupon);

module.exports = router;
