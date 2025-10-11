import argon2 from "argon2";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import User from "../../../models/UserModel/user.model.js";
import dotenv from 'dotenv';

dotenv.config();


const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY;

User.initialize();


const login = asyncHandler(async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({ "Message": "Please enter email and password" });
        }

        const currentUser = await User.findUser(email);
        if (!currentUser) {
            return res.status(403).json({ "Message": "Invalid email or password" });
        }

        const passwordMatch = await argon2.verify(currentUser.password, password);
        if (passwordMatch) {
            const accessToken = jwt.sign({
                user: { email }
            }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
            

            const refreshToken = jwt.sign({
                user: { email }
            }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


            let refreshTokenAdded = await User.updateRefreshToken(email, refreshToken);
            if(!refreshTokenAdded){
                console.log("Error updating refresh token")
                throw Error;
            }


            return res.status(200).json({ "Message": "User logged in successfully", accessToken, refreshToken });
        } 
        else {
            return res.status(403).json({ "Message": "Invalid email or password" });
        }
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ "Message": "Error on server side while logging in" });
    }
});


const register = asyncHandler(async (req, res) => {
    try{
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(403).json({ "Message": "Please enter all fields" });
        }
    
        const userExists = await User.findUser(email);
        if (userExists) {
            return res.status(403).json({ "Message": "Email already exists" });
        }
    
        const hashedPassword = await argon2.hash(password);
        await User.addUser({ userName, email, password: hashedPassword });
    
        const accessToken = jwt.sign({
            user: { email }
        }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        

        const refreshToken = jwt.sign({
            user: { email }
        }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


        let refreshTokenAdded = await User.updateRefreshToken(email, refreshToken);
        if(!refreshTokenAdded){
            throw Error;
        }

        return res.status(200).json({ "Message": "Registered user successfully", accessToken, refreshToken });

    }
    catch(error){
        return res.status(500).json({ "Message": "Error on server side while registering the user" });
    }
});


const generateNewAccesToken = async(req,res) =>{
    try {
        let refreshToken = req.body.refreshToken;
        if(!refreshToken){
            return res.status(401).json({ "Message": "Error refreshToken not provided"});
        }

        let email;
        try {
            // verify the refresh token
            const decodedUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            email = decodedUser.user.email;
        } 
        catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ "Message": "Refresh token expired, please log in again" });
            } 
            else {
                console.log('email',email);
                return res.status(403).json({ "Message": "Invalid refresh token" });
            }
        }




        let userData = await User.getRefreshToken(email);
        if (!userData || userData.refreshtoken !== refreshToken) {
            console.log('userData :',userData);
            return res.status(403).json({ Message: "Invalid refresh token" });
        }
        if(userData.refreshtoken === refreshToken){
            const accessToken = jwt.sign({
                user: { email }
            }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
            return res.status(200).json({ "Message": "New Access Token Generated", accessToken, refreshToken }); 
        }
        else{
            return res.status(401).json({"Message":"Refresh token expired"});
        }
    } 
    catch (error) {
        return res.status(500).json({ "Message": "Error on server side while logging the user" });
    }
}

const getUserData = asyncHandler(async (req, res) => {
    const { email } = req.user; // assuming email is decoded from token
    const user = await User.findUser(email);
    res.json(user);
});

export { login, register, generateNewAccesToken };