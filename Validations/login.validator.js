import Joi from "joi";

const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/ 

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(passwordValidator)
})

export default loginSchema;