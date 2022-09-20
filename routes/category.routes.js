import express from 'express';
import { verifyLogin } from "../Middleware/Verification.js";
import { validate } from 'express-validation';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controllers.js";
import Validator from '../Middleware/Validator.js';

const router = express.Router();

// @route   GET /categories
// @desc    Get all categories
// @access  Public

router.get('/categories', verifyLogin, getCategories);

// @route   GET /category/categoryId
// @desc    Get category
// @access  Public

router.get('/category/categoryId', verifyLogin, getCategoryById);

// @route   POST /category
// @desc    Create category
// @access  Public

router.post('/category', verifyLogin, Validator('category'), createCategory);

// @route   PUT /category/:id
// @desc    Update category
// @access  Public

router.put('/category/:categoryId', verifyLogin, updateCategory);

// @route   DELETE /category/:categoryId
// @desc    Delete category
// @access  Public

router.delete('/category/:categoryId', verifyLogin, deleteCategory);

export default router;