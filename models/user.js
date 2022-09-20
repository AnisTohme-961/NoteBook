import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String, 
        default: null
    },
    username: {
        type: String, 
        required: [true, 'Username is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    password: {
        type: String, 
        required: [true, 'Password is required.']
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
}, { timestamps: true })

export default mongoose.model('User', userSchema);