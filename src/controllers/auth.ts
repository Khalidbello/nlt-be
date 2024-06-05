import { Request, Response } from 'express';
import { checkUserExist, createNewUser } from '../services/user-queries';
import { CustomSessionData } from './../types/session-types';
import { checkUserExistType } from '../types/general';


// function to handle user login
const logInHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(req.body, 'request body in oginnnnnnnnn');
    try {
        const response: [checkUserExistType] = await checkUserExist(email);
        console.log('response for log  in', response);
        if (response.length > 0 && response[0].password === password) {
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'normal',
                id: response[0].user_id
            }
            return res.status(200).json({ message: 'logged in succesfully' });
        };
        res.status(404).json({ message: 'user with cridentials not found' });
    } catch (err) {
        res.status(500).json({ message: err });
    };
};



// function to handle creating of new accont 
const createAccountHandler = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, phoneNumber, gender } = req.body;
    const date = new Date();

    try {
        const response: [{ password: string }] = await checkUserExist(email);

        if (response.length > 0) {
            return res.status(409).json({ message: 'user exist' });
        };

        const created = await createNewUser(firstName, lastName, email, password, phoneNumber, gender, date);
        console.log(created, 'createdddddd', created.insertId);

        if (created.affectedRows > 0) {
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'normal',
                // @ts-ignore
                id: created.insertId
            };
            return res.json({ message: 'account created successfully' });
        };
        throw 'unable to create new user';
    } catch (err) {
        res.status(500).json({ message: 'An error occured trying to create acount' });
    };
};

export { logInHandler, createAccountHandler };