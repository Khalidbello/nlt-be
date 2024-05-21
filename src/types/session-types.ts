import { SessionData } from "express-session";

// Define a custom interface that extends SessionData
interface CustomSessionData extends SessionData {
    user?: {
        email: string;
        type: 'normal' | 'admin' | 'super';
    }; // Define the type of the user object
}

export type { CustomSessionData }