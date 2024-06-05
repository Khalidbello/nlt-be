import { Express } from 'express';
import mysql, { Pool, MysqlError } from 'mysql';
import storeErrorMessage from './error-recorder';

const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

function initiateDbConnection(app: Express, port: string | number) {
    pool.getConnection((err: MysqlError, connection) => {
        if (err) {
            console.log('Error connecting to db', err.stack)
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