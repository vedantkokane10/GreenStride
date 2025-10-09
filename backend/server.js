import express from "express";
import cors from "cors";    

import {connectDB} from './config/mongoDB/db.js';
import pool from "./config/postgresSQL/db.js";

import authenticationRoutes from './routes/AuthenticationRoutes/authentication.routes.js'
import activityRoutes from './routes/ActivityRoutes/activity.routes.js'
import blogRoutes from './routes/BlogRoutes/blog.routes.js'

import { rateLimit } from "express-rate-limit";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8000;

// connecting to mongodb database
connectDB(); 


// connecting to postgresSQL database
pool.connect()
  .then(() => console.log('Connected to the PostgresSQL database'))
  .catch((err) => console.error('Error connecting to the database:', err));



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

app.listen(PORT,function(){
    console.log("App started at " + PORT);
})