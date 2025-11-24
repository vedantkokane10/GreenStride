import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"userName is needed"],
        trim:true
    },
    title:{
        type:String,
        required:[true,"title is needed"],
        trim:true
    },
    email:{
        type:String,
        required: [true, "email is needed"],
        trim: true 
    },
    content:{
        type:String,
        required: [true, "post's text is needed"],
    },
    dateAdded:{
        type:Date,
        default: Date.now
    }
});


export default mongoose.model('Blog',BlogSchema);
// saved as blogs in mongo database