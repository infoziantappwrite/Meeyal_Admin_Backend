const { deleteFromS3 } = require('../utils/deletes3');

const deleteSingleImageBanner = async (offerId) => {
  try {
    // Delete from S3 using image URL

    console.log("Deleting S3 image for offerId:", offerId);
    
    if (offerId) {
      await deleteFromS3(offerId);
    }
    return { success: true, message: 'Offer deleted from DB and S3' };
  } catch (error) {
    throw new Error(`Failed to delete offer image: ${error.message}`);
  }
};

module.exports = deleteSingleImageBanner;
