import express from 'express';
import { verifyLogin } from '../Middleware/Verification.js';
import { deleteUser, getUserById, getUsers, updateUser, changePassword } from '../controllers/user.controllers.js';
import Validator from '../Middleware/Validator.js';

const router = express.Router();

// @route   GET /users
// @desc    Get all users
// @access  Private

router.get('/', verifyLogin, getUsers);

// @route   GET /user/:id
// @desc    Get user
// @access  Private

router.get('/:id', verifyLogin, getUserById);

// @route   PUT /user/:id
// @desc    Update user
// @access  Private

router.put('/', verifyLogin, Validator('user'), updateUser);

// @route   DELETE /user/:id
// @desc    Delete user
// @access  Private

router.delete('/', verifyLogin, deleteUser);

// @route   PATCH /users
// @desc    Change password
// @access  Private
router.patch('/', verifyLogin, Validator('password'), changePassword);

export default router;