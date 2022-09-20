import Joi from "joi";

const passwordValidator = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/  // Password must have at least 1 number and 1 special character (6-16)

const signupSchema = Joi.object({
    username: Joi.string().required().min(3).max(30).alphanum(),
    email: Joi.string().email().required().alphanum(),
    password: Joi.string().required().pattern(passwordValidator)
});

export default signupSchema;