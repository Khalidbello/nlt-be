import { Request, Response } from 'express';
import { checkUserExist, createNewUser } from '../../services/users/user-queries';
import { CustomSessionData } from '../../types/session-types';
import { checkUserExistType } from '../../types/general';
import emailOtpSender from '../../modules/emailers/email-otp';
import otpGenerator from '../../modules/otp-generator';
import { queryDeleteOtp, queryOtp } from '../../services/otp-queries';


// function to handle user login
const logInHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const response: [checkUserExistType] = await checkUserExist(email);

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
        console.error('error in login handler', err);
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
        console.error('error in create accont handler', err);
        res.status(500).json({ message: 'An error occured trying to create acount' });
    };
};


// function to checkif user exist 
const passwordRecoveryCheckUser = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email;
        const exist = await checkUserExist(email);


        if (!exist[0]) return res.status(404).json({ message: 'user with credentials not found.' });

        // ts-ignore
        const opt: number = await otpGenerator(exist[0].user_id);
        // send otp email
        emailOtpSender(email, exist[0].first_name, opt);

        res.json({ message: 'user exist' });
    } catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured trying to find account' });
    };
};


// function to confirm otp if valid retrun user password
const passwordRecoveryConfirmOtp = async (req: Request, res: Response) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;

        if (!email || !otp) return res.status(400).json({ message: 'incomlete data sent to server' });

        const user = await checkUserExist(email);
        const dbOtp = await queryOtp(user[0].user_id);
        const equal: boolean = otp === dbOtp?.otp;

        if (!equal) return res.status(401).json({ status: equal });

        await queryDeleteOtp(user[0].user_id);

        res.json({ password: user[0].password });
    } catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured tryng get user password' });
    };
};


export { logInHandler, createAccountHandler, passwordRecoveryCheckUser, passwordRecoveryConfirmOtp };