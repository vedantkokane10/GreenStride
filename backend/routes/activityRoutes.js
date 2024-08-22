import express from 'express';
import {addActivity,getActivites,getActivitesByCategory,getSuggestions} from '../controllers/ActivityController.js';
import {validateToken} from '../middleware/validateTokenHandler.js'
import {getLeaderboard} from '../controllers/LeaderboardController.js';
const router = express.Router();

router.get('/',(req,res) =>{
    res.json({'message' : "Activity api"})
});


router.get('/getLeaderboard',validateToken,getLeaderboard);

router.post('/addActivity',validateToken,addActivity);

router.get('/getActivities',validateToken,getActivites);

router.get('/getActivitiesByCategory',validateToken,getActivitesByCategory);
router.get('/getSuggestions',validateToken,getSuggestions);

export default router;
