import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        reuired: [true, "Please enter a name"],
        trim: true // to remove whitespace
    },
    email:{
        type:String,
        required: [true, "Please enter an email"],
        unique: true, // to ensure email is unique
        trim: true // to remove whitespace
    },
    password:{
        type: String,
        required: [true, "Please enter a password"],
        minlength: 8, // to ensure password is at least 8 characters long
        trim: true // to remove whitespace
    }

},{
    timestamps: true // to automatically create createdAt and updatedAt fields
});


export default mongoose.model('user',userSchema);

