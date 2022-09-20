import mongoose, { Schema } from "mongoose";

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    writtenBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'    
    }
}, { timestamps: true })

export default mongoose.model('Category', categorySchema);