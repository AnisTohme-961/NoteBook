import express from "express";
import { login, signUp } from "../controllers/auth.js";
import userValidations from '../Validations/user.validations.js';
import { validate } from "express-validation";

const router = express.Router();

// @route   POST /signup
// @desc    User sign up
// @access  Private

router.post('/signup', validate(userValidations.userValidator), signUp);

// @route   POST /login
// @desc    User login
// @access  Private

router.post('/login', login)

export default router;