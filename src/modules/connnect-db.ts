import { Express } from 'express';
import mysql, { Pool, MysqlError } from 'mysql';

const pool: Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kH9L!DJ9EG9R!ST',
    database: 'nlt',
});

function initiateDbConnection(app: Express, port: string | number) {
    pool.getConnection((err: MysqlError, connection) => {
        if (err) {
            console.log('Error connecting to db', err.stack)
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