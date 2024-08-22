import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const ACESS_TOKEN_SECRET = 'Footprint123'

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log("Token received:", token);

        try {
            const decoded = jwt.verify(token, ACESS_TOKEN_SECRET);
            req.user = decoded.user;    
            console.log("Token validated successfully");
            next();
        } catch (err) {
            console.log("Token validation failed:", err.message);
            res.status(403).json({ "Message": "User not registered" });
        }
    } else {
        console.log("Token not provided");
        res.status(403).json({ "Message": "Token not provided" });
    }
});


export {validateToken};