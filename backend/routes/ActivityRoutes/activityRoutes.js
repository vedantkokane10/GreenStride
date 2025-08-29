import express from 'express';
import {addActivity, getActivitesByDate,getActivites,getActivitesByCategory,getSuggestions} from '../../controllers/services/Activity/ActivityController.js';
import {validateToken} from '../../middleware/JWT Token Handler/validateTokenHandler.js'
import {getLeaderboard} from '../../controllers/services/Leaderboard/LeaderboardController.js';
const router = express.Router();

router.get('/',() =>{
    res.json({'message' : "Activity api"})
});


// @description get the leaderboard
// @route GET /getLeaderboard
// @access public
router.get('/getLeaderboard',validateToken,getLeaderboard);

// @description add a new addActivity
// @route POST /addActivity
// @access public
router.post('/addActivity',validateToken,addActivity);

// @description get all the Activities
// @route GET /getActivities
// @access public
router.get('/getActivities',validateToken,getActivitesByDate);

// @description get activity by category
// @route GET /getActivitiesByCategory
// @access public
router.get('/getActivitiesByCategory',validateToken,getActivitesByCategory);

// @description get AI Suggestions to reduce carbon footprints
// @route GET /getSuggestions
// @access public
router.get('/getSuggestions',validateToken,getSuggestions);

export default router;