const express = require('express');
const router = express.Router();
const deleteSingleImage = require('../controllers/deleteSingleImage');

router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteSingleImage(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
