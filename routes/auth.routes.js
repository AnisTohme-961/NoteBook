import { login, signUp } from "../controllers/auth.js";
<<<<<<< HEAD
import Validator from "../Middleware/Validator.js";
=======

import Validator from "../Middleware/Validator.js";
import express from "express";
import userValidations from '../Validations/user.validations.js';
>>>>>>> bc11d7d15879641e1e2c5755de53c1407cf8b789
import { validate } from "express-validation";

const router = express.Router();

// @route   POST /signup
// @desc    User sign up
// @access  Private

<<<<<<< HEAD
router.post('/signup', Validator('signup') , signUp);
=======
router.post('/signup', Validator('signup'), signUp);
>>>>>>> bc11d7d15879641e1e2c5755de53c1407cf8b789

// @route   POST /login
// @desc    User login
// @access  Private

router.post('/login', Validator('login'), login)

export default router;