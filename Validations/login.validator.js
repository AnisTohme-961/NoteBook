import Joi from "joi";

const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/


const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(passwordValidator).required(),
});

export default loginSchema;