import Activity from '../../../models/ActivityModel/activity.model.js';
import {ApiResponse} from '../../../utils/ApiResponse.util.js';
import {ApiError} from '../../../utils/ApiError.util.js';
Activity.initialize();

const getLeaderboard = async (req,res) => {
    try {
        const date = new Date();
        const country = req.user.country;

        const currentMonth = date.getMonth() + 1; // month is based on 0-based index
        const activities = await Activity.getLeaderboard(currentMonth,country);
        console.log(country);
        console.log(date);
        console.log(currentMonth);
        console.log(activities);
        return res.status(201).json(new ApiResponse(activities, 'Leaderboard fetched successfully', 201, true));
    } catch (error) {
        // console.error('Error fetching leaderboard:', error);
        // throw error;
        throw new ApiError(500, "Server error while fetching leaderboard");
    }
};

export { getLeaderboard };
