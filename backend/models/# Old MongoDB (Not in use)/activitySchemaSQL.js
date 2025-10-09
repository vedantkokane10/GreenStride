import pool from '../config/db.js';

const Activity = {
    async initialize() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS Activity (
                    email VARCHAR(255) NOT NULL,
                    type VARCHAR(255) NOT NULL,
                    carbonEmission FLOAT NOT NULL,
                    dateAdded DATE NOT NULL,
                    CONSTRAINT fk_user_email FOREIGN KEY (email) 
                    REFERENCES Users(email) ON DELETE CASCADE
                );
            `);
            console.log("Activity table created or already exists.");
        } catch (error) {
            console.error("Error creating Activity table:", error);
        }
    },

    async addActivity(activity) {
        const email = activity.email;
        const type = activity.type;
        const carbonEmission = activity.carbonEmission;
        const dateAdded = activity.dateAdded;
        //const { email, type, carbonEmission, dateAdded } = activity;
        try {
            await pool.query(`
                INSERT INTO Activity (email, type, carbonEmission, dateAdded) 
                VALUES ($1, $2, $3, $4);
            `, [email, type, carbonEmission, dateAdded]);
            console.log("Activity added successfully");
        } catch (error) {
            console.error("Error adding activity:", error);
        }
    },

    async getAllActivities(email) {
        try {
            const result = await pool.query(`
                SELECT * FROM Activity WHERE email = $1;
            `, [email]);
            return result.rows;
        } catch (error) {
            console.error("Error getting all activities:", error);
        }
    },

    async getAllActivitiesByType(email) {
        try {
            const result = await pool.query(`
                SELECT type, SUM(carbonEmission) AS totalEmission 
                FROM Activity 
                WHERE email = $1 
                GROUP BY type;
            `, [email]);
            return result.rows;
        } catch (error) {
            console.error("Error getting all activities by type:", error);
        }
    },

    async getAllActivitiesByMonth(email, month) {
        try {
            const result = await pool.query(`
                SELECT * FROM Activity 
                WHERE EXTRACT(MONTH FROM dateAdded) = $2 
                AND email = $1;
            `, [email, month]);
            return result.rows;
        } catch (error) {
            console.error("Error getting all activities by month:", error);
        }
    },

    async getLeaderboard(month) {
        try {
            const result = await pool.query(`
                SELECT u1.userName, SUM(a1.carbonEmission) AS totalEmission 
                FROM Activity a1 
                INNER JOIN Users u1 ON a1.email = u1.email 
                WHERE EXTRACT(MONTH FROM a1.dateAdded) = $1 
                GROUP BY u1.userName 
                ORDER BY totalEmission ASC;
            `, [month]);
            return result.rows;
        } catch (error) {
            console.error("Error getting leaderboard:", error);
        }
    }
};

export default Activity;





