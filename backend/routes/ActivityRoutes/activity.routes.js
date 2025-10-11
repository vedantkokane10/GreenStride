import express from 'express';
import {addActivity, getActivitesByDate,getActivites,getActivitesByCategory,getSuggestions, getActivities} from '../../controllers/services/Activity/Activity.controller.js';
import {validateToken} from '../../middleware/JWT Token Handler/validateTokenHandler.middleware.js'
import {getLeaderboard} from '../../controllers/services/Leaderboard/Leaderboard.controller.js';
const router = express.Router();



// @description get the leaderboard
// @route GET /leaderboard
// @access public
router.get('/leaderboard',validateToken,getLeaderboard);

// @description add a new addActivity
// @route POST /activity
// @access public
router.post('/',validateToken,addActivity);

// @description get all the Activities for current Month
// @route GET /current-month
// @access public
router.get('/current-month',validateToken,getActivitesByDate);

// @description get all the Activities for current Month
// @route GET /activity
// @access public
router.get('/',validateToken,getActivities);


// @description get activity by category
// @route GET /activities-by-category
// @access public
router.get('/activities-by-category',validateToken,getActivitesByCategory);

// @description get AI Suggestions to reduce carbon footprints
// @route GET /suggestions
// @access public
router.get('/suggestions',validateToken,getSuggestions);

export default router;