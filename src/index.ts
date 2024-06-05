//ngrok http --domain=weekly-settled-falcon.ngrok-free.app 5000


import * as dotenv from 'dotenv';
dotenv.config();


import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { initiateDbConnection } from './modules/connnect-db';
import auth from './routes/auth';
import users from './routes/users';
import paymentGateWay from './routes/payment-gateway';

// Create an Express application
const app = express();
const port = 5000;


// environment configurations
if (process.env.NODE_ENV === 'development') {
    process.env.FLW_PB_KEY = process.env.FLW_TEST_PB_KEY;
    process.env.FLW_SCRT_KEY = process.env.FLW_TEST_SCRT_KEY;
    process.env.FLW_H = process.env.FLW_H_TEST;
}

// lockingin middle wears
// cors config
const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
};

const sessionOption = {
    secret: 'vnevnkldcfofeoe;v ijruivr',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false, // Ensure this is false for HTTP
        httpOnly: true,
        maxAge: 0.5 * 60 * 60 * 1000,
        domain: 'localhost' // Corrected domain
    }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOption));
app.use(session(sessionOption))


// adding routes as middle wears
app.use('/auth', auth);
app.use('/users', users);
app.use('/gateway', paymentGateWay);


// Define a route handler for the root path
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


// Catch-all route to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('404 Not Found');
});


// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// app begins to listen after db connection
initiateDbConnection(app, port);