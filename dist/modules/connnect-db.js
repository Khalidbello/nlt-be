"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateDbConnection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const error_recorder_1 = __importDefault(require("./error-recorder"));
const pool = mysql_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
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