import argon2 from "argon2";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import User from "../../../models/UserModel/user.model.js";
import dotenv from 'dotenv';

dotenv.config();


const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;


User.initialize();


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(403).json({ "Message": "Please enter email and password" });
        return;
    }

    const currentUser = await User.findUser(email);
    if (!currentUser) {
        res.status(403).json({ "Message": "Invalid email or password" });
        return;
    }

    const passwordMatch = await argon2.verify(currentUser.password, password);
    if (passwordMatch) {
        const accessToken = jwt.sign({
            user: { email }
        }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({ "Message": "User logged in successfully", accessToken });
    } else {
        res.status(403).json({ "Message": "Invalid email or password" });
    }
});


const register = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        res.status(403).json({ "Message": "Please enter all fields" });
        return;
    }

    const userExists = await User.findUser(email);
    if (userExists) {
        res.status(403).json({ "Message": "Email already exists" });
        return;
    }

    const hashedPassword = await argon2.hash(password);
    await User.addUser({ userName, email, password: hashedPassword });

    const accessToken = jwt.sign({
        user: { email }
    }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ "Message": "Registered user successfully", accessToken });
});

const getUserData = asyncHandler(async (req, res) => {
    const { email } = req.user; // assuming email is decoded from token
    const user = await User.findUser(email);
    res.json(user);
});

export { login, register };
    