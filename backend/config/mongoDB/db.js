import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;


const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(uri);
        console.log('MongoDB Database Connected...');
    }
    catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export {connectDB};