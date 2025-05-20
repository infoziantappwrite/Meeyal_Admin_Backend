const { deleteFromS3 } = require('../utils/deletes3');
const ProductImage = require('../models/ProductImage');
const OfferImages= require('../models/Offer');

const deleteSingleImage = async (imageId) => {
  try {
    const imageDoc = await ProductImage.findById(imageId);
    if (!imageDoc) {
      throw new Error('Image not found in database');
    }

    await deleteFromS3(imageDoc.imageUrl);
    await ProductImage.findByIdAndDelete(imageId);

    return { success: true, message: 'Image deleted from database and S3' };
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};



module.exports = deleteSingleImage;
