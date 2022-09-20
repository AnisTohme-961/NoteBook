import Joi from "joi";

<<<<<<< HEAD
const passwordValidator = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/  // Password must have at least 1 number and 1 special character (6-16)

const signupSchema = Joi.object({
    username: Joi.string().required().min(3).max(30).alphanum(),
    email: Joi.string().email().required().alphanum(),
    password: Joi.string().required().pattern(passwordValidator)
=======
const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/


const signupSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(passwordValidator).required(),
>>>>>>> bc11d7d15879641e1e2c5755de53c1407cf8b789
});

export default signupSchema;