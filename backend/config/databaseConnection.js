import mongoose from 'mongoose';



const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB Database Connected...');
    }
    catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export {connectDB};
