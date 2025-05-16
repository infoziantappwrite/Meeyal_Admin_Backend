// controllers/productController.js
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const uploadToS3 = require('../utils/s3')
const deleteFromS3 = require('../utils/deletes3');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('subCategory')
      .populate('productImages');

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('subCategory')
      .populate('productImages');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      details,
      stock,
      discountPrice,
      originalPrice,
      category,
      subCategory,
      status,
      sold,
    } = req.body;

    // Basic validation
    if (!productName || !details || !stock || !originalPrice || !category) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No product images uploaded' });
    }

    // Upload to S3
    const imageUrls = await Promise.all(
      req.files.map(async (file) => await uploadToS3(file))
    );

    // Create image documents
    const productImageDocs = await Promise.all(
      imageUrls.map((url) => ProductImage.create({ imageUrl: url }))
    );

    // Create main product
    const product = await Product.create({
      productName,
      details,
      stock,
      discountPrice,
      originalPrice,
      category,
      subCategory,
      status: status || 'available',
      sold: sold || 0,
      productImages: productImageDocs.map((img) => img._id),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  // console.log("Update product request body:", req.body);
  
  try {
    const productId = req.params.id;
    const update = { ...req.body };







    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => await uploadToS3(file))
      );

      const imageDocs = await Promise.all(
        imageUrls.map((url) => ProductImage.create({ imageUrl: url }))
      );

      console.log("New image documents:", imageDocs);
      

       const newImageIds = imageDocs.map((img) => img._id);

  // Fetch current product's images
  const currentProduct = await Product.findById(productId);

  if (!currentProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Combine old and new image IDs
  update.productImages = [...currentProduct.productImages, ...newImageIds];
}


    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    }).populate("category subCategory productImages");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).populate('productImages');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete each image from S3
    if (product.productImages.length > 0) {
      await Promise.all(
        product.productImages.map(async (img) => {
          console.log("Deleting image from S3:", img.imageUrl);
          
          await deleteFromS3(img.imageUrl); // Deletes from S3
        })
      );
    }

    // Delete from DB
    await ProductImage.deleteMany({ _id: { $in: product.productImages.map(img => img._id) } });

    res.status(200).json({ message: 'Product and images deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};