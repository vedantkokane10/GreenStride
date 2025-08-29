import Activity from '../../../models/ActivityModel/activity.js';

Activity.initialize();

const getLeaderboard = async (req,res) => {
    try {
        const date = new Date();
        const currentMonth = date.getMonth() + 1; // month is based on 0-based index
        const activities = await Activity.getLeaderboard(currentMonth);
        console.log(date);
        console.log(currentMonth);
        console.log(activities);
        return res.json(activities);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error; // Re-throw the error to handle it in the route/controller
    }
};

export { getLeaderboard };
