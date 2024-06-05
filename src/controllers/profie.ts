import { Request, Response } from "express";
import { queryUpdatePassword, queryUpdateUserNames, queryUserProfile } from "../services/user-query-3";
import { CustomSessionData } from "../types/session-types";

const getUserProfileData = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        //@ts-ignore
        const userData = await queryUserProfile(userId)

        res.json(userData);
    } catch (err) {
        console.log('error in get user prodile data', err)
        res.status(500).json({ messagge: err })
    }
};


// function to handle password changing
const handleChangePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const { password, newPassword } = req.body;

        if (!userId || !password || !newPassword) return res.status(402).json({ message: 'incomplete data sent to server for processing' });

        const profileData = await queryUserProfile(userId);

        if (profileData.password !== password || password.length < 8 || newPassword.length < 8) return res.status(401).json({ message: 'Incorrect password entered' });

        const updated = await queryUpdatePassword(userId, newPassword);

        if (!updated) throw 'something went wrong updatig user Names';

        res.json({ status: updated });

    } catch (err) {
        console.log('error changing user password', err);
        res.status(500).json({ message: err });
    }
}


// fuunction to handle change name
const handleChangeNames = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const { firstName, lastName } = req.body;
        if (!userId || !firstName || !lastName) return res.status(402).json({ message: 'incomplete data sent to server for processing' });

        const updated = await queryUpdateUserNames(userId, firstName, lastName);

        if (!updated) throw 'something went wrong updatig user Names';

        res.json({ status: updated });
    } catch (err) {
        console.log('error in changing user names password', err);
        res.status(500).json({ message: err });
    }
}


export {
    getUserProfileData,
    handleChangePassword,
    handleChangeNames,
}