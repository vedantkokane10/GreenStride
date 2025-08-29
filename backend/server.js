import express from "express";
import cors from "cors";    

import {connectDB} from './config/mongoDB/db.js';
import pool from "./config/postgresSQL/db.js";

import authenticationRoutes from './routes/AuthenticationRoutes/authenticationRoutes.js'
import activityRoutes from './routes/ActivityRoutes/activityRoutes.js'
import blogRoutes from './routes/BlogRoutes/blogRoutes.js'


const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8000;

connectDB();

pool.connect()
  .then(() => console.log('Connected to the PostgresSQL database'))
  .catch((err) => console.error('Error connecting to the database:', err));


const greetMessage = (req,res) => {
  return res.json({"Message":"Welcome to GreenStride Backend API!"})
};

app.get('/',greetMessage);

app.use('/api/authentication/',authenticationRoutes);

app.use('/api/activity/',activityRoutes);

app.use('/api/blog/', blogRoutes);

app.listen(PORT,function(){
    console.log("App started at " + PORT);
})