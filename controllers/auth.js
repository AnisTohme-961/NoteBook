import User from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import createError from "../util/Error.js";
import { generateUserToken } from "../util/Token.js";

let transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD   
    }
})

export const signUp = async (req, res, next) => {

    const { username, email, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,12);

    try {
    const user = new User({
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
    })
    const result = await user.save();
    res.status(201).json({
        message: 'Sign Up successful', 
        data: result
    });
    const sentEmail = await transporter.sendMail({  
        to: email,
        from: 'noteapp@euriskomobility.com',
        subject: 'SignUp Succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      })  
    res.status(250).json({
        message: 'Requested mail sent to the registered user',
        sentEmail: sentEmail
    })
   }
    catch (error) {
        next (error)
    }  
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
    const user = await User.findOne({email: email}); 
    if (!user) {
        return next(createError("User not found", 404))
    }
    const isEqual = bcrypt.compareSync(password, user.password);
    if (!isEqual) {
        return next(createError("Invalid Password."), 401);
    }

    const { accessToken, refreshToken } = generateUserToken(user);

    const { _id } = user;
    
    await User.findOneAndUpdate({_id}, refreshToken);    // refresh token is added to the database

    const { token, ...userData } = user._doc;   // _doc removes refresh token from user data

    userData.accessToken = accessToken;     // access token is added to user data

    res.status(200).json({
        success: true,
        message: `${user.username} logged in successfully.`,
        user: userData
    })
  }
    catch (error) {
        next (error)
    }
}
