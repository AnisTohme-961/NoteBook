import express from 'express';
import { verifyLogin } from '../Middleware/Verification.js';
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/user.controllers.js';

const router = express.Router();

// @route   GET /users
// @desc    Get all users
// @access  Public

router.get('/users', verifyLogin, getUsers);

// @route   GET /user/:id
// @desc    Get user
// @access  Public

router.get('/user/id', verifyLogin, getUserById);

// @route   PUT /user/:id
// @desc    Update user
// @access  Public

router.put('/user/:id', verifyLogin, updateUser);

// @route   DELETE /user/:id
// @desc    Delete user
// @access  Public

router.delete('/user/:id', verifyLogin, deleteUser);

export default router;