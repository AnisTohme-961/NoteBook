import User from '../models/user.js';
import bcrypt from "bcrypt";
import createError from '../util/Error.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (users.length <= 0) {
            return next(createError("Users not found.", 404))
        }
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users: users,
            count: users.length
        })
    }
    catch (error) {
        next (error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return next(createError(`User not found with id ${userId}`, 404))
        }
        res.status(200).json({
            success: true,
            message: "User found successfully",
            user: user
        })
    }
    catch (error) {
        next (error)
    }
}

export const createUser = async (req, res, next) => {
    const { firstName, lastName, userName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: hashedPassword
        })
        await user.save();
        res.status(201).json({
            success: true, 
            message: "User created successfully.",
            user: user
        })
    }
    catch (error) {
        next (error)
    }
}

export const updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const { firstName, lastName, userName, email } = req.body;
    try {
        const user = await User.findOneAndUpdate({ userId }, { firstName, lastName, userName, email }, { new: true });
        if (!user) {
            return next(createError(`User not found with id ${userId}`, 404));
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user: user
        })       
    }
    catch (error) {
        next (error)
    }
}

export const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findOneAndDelete({userId});
        if (!user) {
            return next(createError(`User not found with id ${userId}`, 404))
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user: user
        })
    }
    catch (error) {
        next (error)
    }
}





