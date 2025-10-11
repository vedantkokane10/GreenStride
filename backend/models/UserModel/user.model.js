import pool from '../../config/postgresSQL/db.js';

class User{
    static  initialize = async() => {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    userName VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    refreshToken varchar(255),
                    PRIMARY KEY (email)
                );
            `);
            console.log('Checked or created users table');
        } catch (error) {
            console.error('Error creating users table:', error);
        }
    }

    static  addUser = async(user) =>{
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
    }

    static  findUser = async(email) => {
        try {
            const result = await pool.query(`
                SELECT * FROM users 
                WHERE email = $1;
            `, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user:', error);
            return null;
        }
    }


    static  updateRefreshToken = async(email, refreshToken) =>{
        try {
           // let result = await pool.query(`update users set refreshToken = $1 where email = $2;`, [refreshToken, email]);
            const result = await pool.query(
                `UPDATE users SET refreshToken = $1 WHERE email = $2 RETURNING refreshToken;`,
                [refreshToken, email]
            );
            return result.rows[0];
            
        } 
        catch (error) {
            console.error('Error updating refresh token for user:', error);
            return null;
        }
    }

    static getRefreshToken = async(email) =>{
        try {
            let result = await pool.query(`select refreshToken from users where email = $1;`,[email]);
            return result.rows[0];
        }
        catch (error) {
            
        }
    }
};

export default User;
