
// utils/deletes3.js
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
async function deleteFromS3(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const fileName = url.pathname.replace(/^\/+/, '');

    console.log("Deleting S3 image:", fileName);

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    const result = await s3.send(new DeleteObjectCommand(deleteParams));
    console.log("S3 delete result:", result);
  } catch (err) {
    console.error("Error deleting image from S3:", err.message);
  }
}

module.exports = { deleteFromS3 };