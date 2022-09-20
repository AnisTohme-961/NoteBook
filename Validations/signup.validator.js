import Joi from "joi";

const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/


const signupSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(passwordValidator).required(),
});

export default signupSchema;