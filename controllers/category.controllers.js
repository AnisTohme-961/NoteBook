import User from '../models/user.js';
import Category from '../models/category.js';
import createError from '../util/Error.js';
import category from '../models/category.js';
import mongoose from 'mongoose';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        if (categories.length <= 0) {   
            return next(createError("Categories not found.", 404))
        }
        res.status(200).json({
            success: true,
            message: "These are all the categories displayed.",
            categories: categories,
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
                $unwind: {$writtenBy}
            }, 
            {
                $project: {
                    title: 1,
                    _id: 0 ,
                    writtenBy: {
                        $concat: [$firstName, " ", $lastName],
                        email: 1
                    }
                }
            }
        ])

        return categoryAggregate[0];
    }
    catch (error) {
        next(error);
    }
}

export const createCategory = async (req, res, next) => {
    const { title } = req.body;
    try {
        const category = new Category({
            title: title,
        })
        await category.save();
        const user = await User.findById(req.user);
        user.categoryId.push(category);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: category,
            user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
        })
    }
    catch (error) {
        next (error)
    }
}

export const updateCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const title = req.body;
    try {
        const category = await Category.findOneAndUpdate(categoryId, { title }, { new: true });
        if (!category) {
            return next(createError(`Category not found with id ${categoryId}`, 404));
        }
        if (category.writtenBy.toString() !== req.user) {
            return next(createError("User not authorized", 403))
        }
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