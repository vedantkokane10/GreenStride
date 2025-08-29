import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userName:{
        type:String,
        required: [true, "Please enter an email"],
    },
    email:{
        type:String,
        required: [true, "Please enter an email"],
        unique: true, // to ensure email is unique
        trim: true // to remove whitespace
    },
    type:{
        type: String,
        required: true
    },
    carbonEmission:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Activity',activitySchema);