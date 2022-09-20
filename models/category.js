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
<<<<<<< HEAD
=======
        
>>>>>>> bc11d7d15879641e1e2c5755de53c1407cf8b789
    },
    writtenBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'    
    }
}, { timestamps: true })

export default mongoose.model('Category', categorySchema);