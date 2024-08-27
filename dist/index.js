"use strict";
//ngrok http --domain=weekly-settled-falcon.ngrok-free.app 5000
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const connnect_db_1 = require("./modules/connnect-db");
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
const payment_gateway_1 = __importDefault(require("./routes/payment-gateway"));
// Create an Express application
const app = (0, express_1.default)();
const port = 5000;
// environment configurations
if (process.env.NODE_ENV === 'development') {
    process.env.FLW_PB_KEY = process.env.FLW_TEST_PB_KEY;
    process.env.FLW_SCRT_KEY = process.env.FLW_TEST_SCRT_KEY;
    process.env.FLW_H = process.env.FLW_H_TEST;
}
// environment configurations
if (process.env.NODE_ENV === 'production') {
    process.env.FLW_PB_KEY = process.env.FLW_PB_KEY;
    process.env.FLW_SCRT_KEY = process.env.FLW_SCRT_KEY;
    process.env.FLW_H = process.env.FLW_H;
}
// lockingin middle wears
// cors config
// cors config
const corsOption = {
    origin: [' http://localhost', 'https://lifestyleleverage.com.ng', 'http://lifestyleleverage.com.ng'], // Replace with your frontend's origin
    credentials: true
};
const sessionOption = {
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
};
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, cors_1.default)(corsOption));
// @ts-ignore
app.use((0, express_session_1.default)(sessionOption));
// adding routes as middle wears
app.use('/auth', auth_1.default);
app.use('/users', users_1.default);
app.use('/admin', admin_1.default);
app.use('/gateway', payment_gateway_1.default);
// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Catch-all route to handle 404 errors
app.use((req, res, next) => {
    res.status(404).send(`404 Not Found in admin:::::::::: path ${req.url} `);
});
// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// app begins to listen after db connection
(0, connnect_db_1.initiateDbConnection)(app, port);
//# sourceMappingURL=index.js.map