import express from 'express';
import {addActivity, getActivitesByDate,getActivites,getActivitesByCategory,getSuggestions} from '../../controllers/services/Activity/Activity.controller.js';
import {validateToken} from '../../middleware/JWT Token Handler/validateTokenHandler.js'
import {getLeaderboard} from '../../controllers/services/Leaderboard/Leaderboard.controller.js';
const router = express.Router();



// @description get the leaderboard
// @route GET /getLeaderboard
// @access public
router.get('/leaderboard',validateToken,getLeaderboard);

// @description add a new addActivity
// @route POST /addActivity
// @access public
router.post('/',validateToken,addActivity);

// @description get all the Activities for current Month
// @route GET /getActivities
// @access public
router.get('/',validateToken,getActivitesByDate);

// @description get activity by category
// @route GET /getActivitiesByCategory
// @access public
router.get('/activities-by-category',validateToken,getActivitesByCategory);

// @description get AI Suggestions to reduce carbon footprints
// @route GET /getSuggestions
// @access public
router.get('/suggestions',validateToken,getSuggestions);

export default router;