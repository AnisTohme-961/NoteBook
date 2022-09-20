import express from "express";
import { login, signUp } from "../controllers/auth.js";
import Validator from "../Middleware/Validator.js";
import { validate } from "express-validation";

const router = express.Router();

// @route   POST /signup
// @desc    User sign up
// @access  Private

router.post('/signup', Validator('signup') , signUp);

// @route   POST /login
// @desc    User login
// @access  Private

router.post('/login', Validator('login'), login)

export default router;