import express from "express";
import {login, register} from "../../controllers/services/Auth/AuthController.js";

const router = express.Router();

router.get('/',(req,res) =>{
    res.json({'message' : "Authentication api"})
});


// @description login existing user
// @route POST /login
// @access public
router.post('/login',login);


// @description Register a new user
// @route POST /register
// @access public
router.post('/register',register);



export default router;