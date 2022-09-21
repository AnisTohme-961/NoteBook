import Joi from "joi";

const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/  
// /^
//   (?=.*\d)          // should contain at least one digit
//   (?=.*[a-z])       // should contain at least one lower case
//   (?=.*[A-Z])       // should contain at least one upper case
//   [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
// $/
const signupSchema = Joi.object({
    username: Joi.string().required().min(3).max(30).alphanum(),
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(passwordValidator),
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
});

export default signupSchema;