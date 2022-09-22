import Category from '../models/category.js';
import User from '../models/user.js';
import category from '../models/category.js';
import createError from '../util/Error.js';
import mongoose from 'mongoose';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            message: "These are all the categories displayed.",
            data: categories,
            count: categories.length
        })
    }
    catch (error) {
        next(error)
    }
}

export const getCategoryById = async (req, res, next) => {
    try {
        /*const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (category.length <= 0) {
            return next(createError("Category not found.", 404));
        }
        res.status(200).json({
            success: true, 
            message: "Category found successfully",
            category: category
        })*/
        const categoryId = req.params.categoryId;
        const categoryAggregate = await Category.aggregate([
            { 
                $match: { _id: mongoose.Types.ObjectId(categoryId) } 
            }, 
            { 
                $lookup: {
                from: 'users',
                localField: 'writtenBy',
                foreignField: '_id',
                as: 'user' 
                } 
            },
            {
                $project: {
                    title: 1,
                    _id: 1,
                    writtenBy: {
                        $concat: ["user.firstName", " ", "user.lastName"],
                        email: "user.email"
                    }
                }
            }
        ])
        // return categoryAggregate[0];
        res.status(200).json({
            success: true, 
            message: "Category found successfully",
            data: categoryAggregate[0]
        })
    }
    catch (error) {
        next(error);
    }
}

export const createCategory = async (req, res, next) => {
    const { title, description } = req.body;
    const {id} = req.user;
    try {
        // check if category already exists
        const exist = await Category.findOne({ title });
        if (exist) {
            return next(createError("Category already exists.", 400));
        }
        const category = new Category({
            title: title,
            description: description,
            writtenBy: id
        })
        await category.save();
        
        // update user with category
        const user = await User.findById(id);
        user.categories.push(category._id);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
            // user: user
        })
    }
    catch (error) {
        next (error)
    }
}

export const updateCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const {id} = req.user;
    const { title, description } = req.body;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(`Category not found with id ${categoryId}`, 404));
        }
        if (category.writtenBy.toString() !== id) {
            return next(createError("User not authorized", 403))
        }
        category.title = title;
        category.description = description;
        await category.save();
        res.status(200).json({
            success: true, 
            message: "Category updated successfully",
            category: category
        })
    }
    catch (error) {
        next (error)
    }
}

export const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(`Category not found with id ${categoryId}`, 404));
        }
        if (category.writtenBy.toString() !== req.user) {
            return next(createError("User not authorized", 403))
        }
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        const user = await User.findOne(req.user);
        user.categoryId.pull(category);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category: deletedCategory
        })
    }
    catch (error) {
        next (error)
    }
}