import express from "express";
import cors from "cors";    

import {connectDB} from './config/mongoDB/db.js';
import pool from "./config/postgresSQL/db.js";

import authenticationRoutes from './routes/AuthenticationRoutes/authentication.routes.js'
import activityRoutes from './routes/ActivityRoutes/activity.routes.js'
import blogRoutes from './routes/BlogRoutes/blog.routes.js'

import { rateLimit } from "express-rate-limit";

import User from "./models/UserModel/user.model.js";
import Activity from "./models/ActivityModel/activity.model.js";


const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8000;


// rate limititing to avoid DoS attack (15 mins => 100 requests) 
const limiter = rateLimit({
  windowMs: (15 * 60) * 1000,
  max:100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

// (fixed window counter algo used)
app.use(limiter)


const greetMessage = (req,res) => {
  return res.json({"Message":"Welcome to GreenStride Backend API!"})
};

app.get('/',greetMessage);

app.use('/api/authentication',authenticationRoutes);

app.use('/api/activity',activityRoutes);

app.use('/api/blog', blogRoutes);

const main = async() =>{
  try {
    console.log("Server started at " + PORT);

    // connecting to mongodb database
    await connectDB(); 

    // connecting to postgresSQL database
    await pool.connect()
    .then(() => console.log('Connected to the PostgresSQL database'))
    .catch((err) => console.error('Error connecting to the database:', err));

    // Initializing the Databases
    User.initialize();
    Activity.initialize();


    console.log("All initial setup like connecting to Database creating tables and middleware things are carried out successfully.")


  } 
  catch (error) {
    console.log(error);
  }
}


app.listen(PORT, main)