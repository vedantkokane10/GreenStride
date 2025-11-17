import express from "express";
import {login, register, generateNewAccesToken, getUserData, updateCountry} from "../../controllers/services/Auth/Auth.controller.js";
import {validateToken} from '../../middleware/JWT Token Handler/validateTokenHandler.middleware.js'
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


// @description Generate a new access token
// @route POST /refresh
// @access public
router.post('/refresh',generateNewAccesToken);

// @description fetches current user's data
// @route GET /user
// @access public
router.get('/user', validateToken, getUserData);


// @description updaates current user's country
// @route PATCH /user
// @access public
router.patch('/user', validateToken, updateCountry);

export default router;