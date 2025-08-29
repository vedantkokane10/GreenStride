import Activity from "../models/activitySchema.js";

const getLeaderboard = async (req,res) => {
    try {
        const activities = await Activity.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: "$userName",
                    totalCarbonEmission: {
                        $sum: "$carbonEmission"
                    }
                }
            },
            {
                $sort: { totalCarbonEmission: 1 } // Sorting in descending order
            },
            {
                $limit: 10
            }
        ]);
        console.log(activities);
        return res.json(activities);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error; // Re-throw the error to handle it in the route/controller
    }
};

export { getLeaderboard };
