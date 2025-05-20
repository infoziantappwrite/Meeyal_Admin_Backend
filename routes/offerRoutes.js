const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.post('/', upload.array('offerImages', 10), createOffer);
router.put('/:id', upload.array('offerImages', 10), updateOffer);
router.delete('/:id', deleteOffer);

module.exports = router;
