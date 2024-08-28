import { Express } from 'express';
//import mysql, { Pool, MysqlError } from 'mysql';
const mysql = require('mysql2');
import storeErrorMessage from './error-recorder';
import { Pool } from 'mysql2';

const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

function initiateDbConnection(app: Express, port: string | number) {
    pool.getConnection((err: any, connection) => {
        if (err) {
            console.error('Error connecting to db', err.stack)
            storeErrorMessage(err)
            process.exit(1);
        }

        console.log('Connected to MYSQL as ID ' + connection.threadId);
        connection.release(); // relawease connection back to pool

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    })
};

export default pool;
export { initiateDbConnection }