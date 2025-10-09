import pool from '../config/db.js';

const User = {
    async initialize() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    userName VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    PRIMARY KEY (email)
                );
            `);
            console.log('Checked or created users table');
        } catch (error) {
            console.error('Error creating users table:', error);
        }
    },

    async addUser(user) {
        const { userName, email, password } = user;
        try {
            const result = await pool.query(`
                INSERT INTO users (userName, email, password) 
                VALUES ($1, $2, $3)
            `, [userName, email, password]);
            console.log('Added new user:', result.rowCount);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    },

    async findUser(email) {
        try {
            const result = await pool.query(`
                SELECT * FROM users 
                WHERE email = $1;
            `, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user:', error);
        }
    }
};

export default User;
