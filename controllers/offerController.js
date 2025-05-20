const Offer = require('../models/Offer');
const uploadToS3 = require('../utils/s3');
const deleteSingleImageBanner = require('../controllers/deleteSingleOffer');


exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers', error });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offer', error });
  }
};

exports.createOffer = async (req, res) => {
   
    
  try {
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ message: 'Tag is required' });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No offer images uploaded' });

    // Upload files to S3
    const imageUrls = await Promise.all(req.files.map(file => uploadToS3(file)));

    // Create an Offer document for each image URL (each with same tag)
   const offer = await Offer.create({ imagesUrl: imageUrls[0], tag });
res.status(201).json(offer); // return single object
  } catch (error) {
    console.error('Offer creation error:', error);
    res.status(500).json({ message: 'Error creating offers', error: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const { tag } = req.body;
    const update = {};
    if (tag) update.tag = tag;

    // If new images are uploaded, replace the imageUrl
    if (req.files && req.files.length > 0) {
      // Upload to S3
      const imageUrls = await Promise.all(req.files.map(file => uploadToS3(file)));

      // For simplicity, we take the first uploaded image to update the existing Offer's imageUrl
      update.imagesUrl = imageUrls[0];

      // Optionally: If you want to handle multiple images per offer, you’d have to change model.
    }

    const updatedOffer = await Offer.findByIdAndUpdate(offerId, update, { new: true });

    if (!updatedOffer) return res.status(404).json({ message: 'Offer not found' });

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating offer', error });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    // console.log("Offer found:", offer);

    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Delete image from S3 using offer.imagesUrl
    if (offer.imagesUrl) {
      await deleteSingleImageBanner(offer.imagesUrl);
      console.log("Deleted image from S3:", offer.imagesUrl);
    }

    // Now delete the offer from DB
    await Offer.findByIdAndDelete(req.params.id);
    console.log("Deleted offer from database:", req.params.id);

    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ message: 'Error deleting offer', error: error.message });
  }
};