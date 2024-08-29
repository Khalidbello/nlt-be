"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateDbConnection = void 0;
//import mysql, { Pool, MysqlError } from 'mysql';
const mysql = require('mysql2');
const error_recorder_1 = __importDefault(require("./error-recorder"));
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
function initiateDbConnection(app, port) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to db', err.stack);
            (0, error_recorder_1.default)(err);
            process.exit(1);
        }
        console.log('Connected to MYSQL as ID ' + connection.threadId);
        connection.release(); // relawease connection back to pool
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    });
}
exports.initiateDbConnection = initiateDbConnection;
;
exports.default = pool;
//# sourceMappingURL=connnect-db.js.map