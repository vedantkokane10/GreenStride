import argon2 from "argon2";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import User from "../../../models/UserModel/user.model.js";
import dotenv from 'dotenv';
import {ApiResponse} from '../../../utils/ApiResponse.util.js';
import {ApiError} from '../../../utils/ApiError.util.js';
dotenv.config();


const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY;

User.initialize();


const countries = [
    "USA",
    "India",
    "China",
    "UK",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Canada",
    "Brazil",
    "Norway",
    "SouthAfrica",
    "UAE",
    "Netherlands",
    "Singapore",
    "SouthKorea",
    "Mexico",
]
  


const login = asyncHandler(async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({ "Message": "Please enter email and password " });
        }

        const currentUser = await User.findUser(email);
        if (!currentUser) {
            return res.status(403).json({ "Message": "Invalid email or password" });
        }
        const country = currentUser.country;
        const passwordMatch = await argon2.verify(currentUser.password, password);
        if (passwordMatch) {
            const accessToken = jwt.sign({
                user: { email, country }
            }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
            

            const refreshToken = jwt.sign({
                user: { email, country }
            }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


            let refreshTokenAdded = await User.updateRefreshToken(email, refreshToken);
            if(!refreshTokenAdded){
                console.log("Error updating refresh token")
                throw Error;
            }
            let result = {accessToken, refreshToken}
            return res.status(200).json(new ApiResponse(result, 'User logged in successfully', 200, true));

            //return res.status(200).json({ "Message": "User logged in successfully", accessToken, refreshToken });
        } 
        else {
            return res.status(403).json(new ApiResponse({}, 'Invalid email or password', 403, false));
            //return res.status(403).json({ "Message": "Invalid email or password" });
        }
    }
    catch(error){
        console.log(error.message);
        throw new ApiError(500, "Error on server side while logging in");
        //res.status(500).json({ "Message": "Error on server side while logging in" });
    }
});


const register = asyncHandler(async (req, res) => {
    try{
        const {userName, email, password, country} = req.body;

        if (!userName || !email || !password || !country) {
            return res.status(403).json({ "Message": "Please enter all fields" });
        }
        
        if(!countries.includes(country)){
            return res.status(403).json({ "Message": "Sorry your country is not supported, currently we only support G20 Countries" });
        }

        const userExists = await User.findUser(email);
        if (userExists) {
            return res.status(403).json({ "Message": "Email already exists" });
        }
    
        const hashedPassword = await argon2.hash(password);
        await User.addUser({ userName, email, password: hashedPassword, country });
    
        const accessToken = jwt.sign({
            user: { email, country }
        }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        

        const refreshToken = jwt.sign({
            user: { email, country }
        }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


        let refreshTokenAdded = await User.updateRefreshToken(email, refreshToken);
        if(!refreshTokenAdded){
            throw Error;
        }

        let result = {accessToken, refreshToken}
        return res.status(200).json(new ApiResponse(result, 'User Registered in successfully', 200, true));
        // return res.status(200).json({ "Message": "Registered user successfully", accessToken, refreshToken });

    }
    catch(error){
        throw new ApiError(500, "Error on server side while registering the user");
        //return res.status(500).json({ "Message": "Error on server side while registering the user" });
    }
});


const generateNewAccesToken = async(req,res) =>{
    try {
        let refreshToken = req.body.refreshToken;
        if(!refreshToken){
            return res.status(401).json({ "Message": "Error refreshToken not provided"});
        }

        let email;
        let country
        try {
            // verify the refresh token
            const decodedUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            email = decodedUser.user.email;
            country = decodedUser.user.country;
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
                user: { email, country }
            }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
            let result = {accessToken, refreshToken}
            return res.status(200).json(new ApiResponse(result, 'New Access Token Generated', 200, true));
           // return res.status(200).json({ "Message": "New Access Token Generated", accessToken, refreshToken }); 
        }
        else{
            return res.status(200).json(new ApiResponse(result, 'Refresh token expired', 200, true));

           // return res.status(401).json({"Message":"Refresh token expired"});
        }
    } 
    catch (error) {
        throw new ApiError(500, "Error on server side while logging the user");
        //return res.status(500).json({ "Message": "Error on server side while logging the user" });
    }
}

const getUserData = asyncHandler(async (req, res) => {
    try {
        const { email } = req.user; //  email is decoded from token by middleware
        const user = await User.findUser(email);
        return res.status(200).json(new ApiResponse(user, 'User data fetched successfully', 200, true));
    }
     catch (error) {
        throw new ApiError(500, "Error on server side while fetching the user details");
    }
});

const updateCountry = asyncHandler(async (req,res) =>{
    try {
        console.log(req.body);
        const {email} = req.user;
        const country = req.body.country;
        console.log(email, country);
        const result = await User.updateCountry(email, country);
        return res.status(200).json(new ApiResponse(result, `User's country updated successfully`, 200, true));
    } catch (error) {
        throw new ApiError(500, "Error on server side while updating the user's country");
    }
})

export { login, register, generateNewAccesToken, getUserData, updateCountry};