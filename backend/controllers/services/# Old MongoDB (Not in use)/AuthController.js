import argon2 from "argon2";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import user from "../models/userSchema.js";

const ACCESS_TOKEN_SECRET = 'Footprint123';

// @description login user
// @route POST /login
// @access public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(403).json({ "Message": "Please enter email and password" });
        return;
    }

    const currentUser = await user.findOne({ email });
    if (!currentUser) {
        res.status(403).json({ "Message": "Invalid email or password" });
        return;
    }

    const isPasswordValid = await argon2.verify(currentUser.password, password);
    if (isPasswordValid) {
        const accessToken = jwt.sign({
            user: {
                id: currentUser._id,
                email: currentUser.email
            }
        }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({ "Message": "User logged in successfully", accessToken });
    } else {
        res.status(403).json({ "Message": "Invalid email or password" });
    }
});

// @description Register user
// @route POST /register
// @access public
const register = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        res.status(403).json({ "Message": "Please enter all fields" });
        return;
    }

    const userExists = await user.findOne({ email });
    if (userExists) {
        res.status(403).json({ "Message": "Email already exists" });
        return;
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await user.create({
        userName,
        email,
        password: hashedPassword
    });

    const accessToken = jwt.sign({
        user: {
            id: newUser._id,
            email: newUser.email
        }
    }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ "Message": "Registered user successfully", accessToken });
});

// @description Get user data
// @route GET /user/:email
// @access private
const getUserData = asyncHandler(async (req, res) => {
    const userData = await user.findOne({ email: req.params.email }).select('-password');
    res.json(userData);
});

export { login, register };
