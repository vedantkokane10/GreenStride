import pool from '../../config/postgresSQL/db.js';

class Activity {
  static async initialize() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS Activity (
          id SERIAL PRIMARY KEY,
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
  }

  static async addActivity({ email, type, carbonEmission, dateAdded }) {
    try {
      const result = await pool.query(
        `INSERT INTO Activity (email, type, carbonEmission, dateAdded) 
         VALUES ($1, $2, $3, $4) RETURNING *;`,
        [email, type, carbonEmission, dateAdded]
      );
      console.log("Activity added successfully:", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding activity:", error);
      return null;
    }
  }

  static async getAllActivities(email) {
    try {
      const result = await pool.query(
        `SELECT * FROM Activity WHERE email = $1 ORDER BY dateAdded DESC;`,
        [email]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting all activities:", error);
      return [];
    }
  }

  static async getAllActivitiesByType(email) {
    try {
      const result = await pool.query(
        `SELECT type, SUM(carbonEmission) AS totalEmission 
         FROM Activity 
         WHERE email = $1 
         GROUP BY type
         ORDER BY totalEmission DESC;`,
        [email]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting all activities by type:", error);
      return [];
    }
  }

  static async getAllActivitiesByMonth(email, month) {
    try {
      const result = await pool.query(
        `SELECT * FROM Activity 
         WHERE email = $1
         AND EXTRACT(MONTH FROM dateAdded) = $2
         ORDER BY dateAdded DESC;`,
        [email, month]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting all activities by month:", error);
      return [];
    }
  }

  static async getLeaderboard(month) {
    try {
      const result = await pool.query(
        `SELECT u1.userName, SUM(a1.carbonEmission) AS totalEmission 
         FROM Activity a1 
         INNER JOIN Users u1 ON a1.email = u1.email 
         WHERE EXTRACT(MONTH FROM a1.dateAdded) = $1 
         GROUP BY u1.userName 
         ORDER BY totalEmission ASC;`,
        [month]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      return [];
    }
  }
}

export default Activity;
