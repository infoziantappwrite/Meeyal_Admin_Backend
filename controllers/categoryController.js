const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Step 1: Delete all subcategories that belong to this category
    await SubCategory.deleteMany({ category: req.params.id });

    // Step 2: Delete the category itself
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category and its subcategories deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category and subcategories', error: error.message });
  }
};
