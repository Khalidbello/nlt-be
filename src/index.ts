//ngrok http --domain=weekly-settled-falcon.ngrok-free.app 5000


import * as dotenv from 'dotenv';
dotenv.config();


import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { initiateDbConnection } from './modules/connnect-db';
import auth from './routes/auth';
import admin from './routes/admin';
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
// cors config
const corsOption = {
    origin: ['https://weekly-settled-falcon.ngrok-free.app', 'http://localhost:3000', 'https://site.botsub.com.ng'], // Replace with your frontend's origin
    credentials: true
};

const sessionOption = {
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 0.5, // 1 minute for example
        httpOnly: true,
        secure: false, // Must be false for local development without HTTPS
        
    }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb'}));
app.use(cors(corsOption));
// @ts-ignore
app.use(session(sessionOption))


// adding routes as middle wears
app.use('/auth', auth);
app.use('/users', users);
app.use('/admin', admin);
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