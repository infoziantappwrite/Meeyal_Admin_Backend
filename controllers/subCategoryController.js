const SubCategory = require('../models/SubCategory');

exports.createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const subCategory = await SubCategory.create({ name, category });
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subcategory', error: error.message });
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category');
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subCategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategory', error: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subcategory not found' });
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
  }
};
