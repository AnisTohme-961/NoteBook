import joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(joi);

const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/

const userValidations = {
    userValidator: {
        body: joi.object({
            firstName: joi.string().required().max(20).message('First Name is required'),
            lastName: joi.string().required().max(20).message('Last Name is required'),
            username: joi.string().required().min(7).max(20).alphanum().message('Username is required'),
            email: joi.string().email().required().alphanum().message('Enter a valid email'),
            password: joi.string().required().regex(passwordValidator).message('Enter a valid password with at least 8 characters long'),
            confirmPassword: joi.string().required().valid(joi.ref('password')),
            category: joi.array().items(myJoiObjectId()),
            note: joi.array().items(myJoiObjectId())
        })
    }
}

export default userValidations;