import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import user from "../models/userSchema.js";

const ACESS_TOKEN_SECRET = ''

//@description login user
//@route POST /login
//@access public
const login = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(403);
        res.json({"Message": "Please enter email and password"});
        return;
    }

    const currentUser = await user.findOne({email: email});
    if(!currentUser){
        res.status(403);
        res.json({"Message": "Invalid email or password"});
        return;
    }

    const hashedPassword = await bcrypt.hash(password,10);
    if(await bcrypt.compare(password,hashedPassword)){
        // user matched
        const accessToken = jwt.sign({
            user:{
                id: currentUser._id,
                email: currentUser.email
            },
        }, ACESS_TOKEN_SECRET, {expiresIn: '1h'})

        res.json({"Message": "User logged in successfully", accessToken});
    }
    else{
        // user not matched
        res.status(403);
        res.json({"Message": "Invalid email or password"});
        return;
    }
})


//@description Register user
//@route POST /Register
//@access public
const register = asyncHandler(async (req, res) =>{
    const {userName, email, password} = req.body;

    if(!userName || !email || !password){
        res.status(403);
        res.json({"Message": "Please enter all fields"});
        return;
    }
    const userExists = await user.findOne({email : email});
    if(userExists){
        res.status(403);
        res.json({"Message": "Email already exists"});
        return;
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await user.create({userName : userName,email: email ,password : hashedPassword});
    const accessToken = jwt.sign({
        user:{
            id: newUser._id,
            email: newUser.email
        }
    }, ACESS_TOKEN_SECRET, {expiresIn: '1h'});
    res.json({"Message": "registered user successfully",
             accessToken});
});

const getUserData = asyncHandler(async (req, res) =>{
    const user = await user.findOne(req.params.email).select('-password');
    res.json(user)
})

export {login, register};