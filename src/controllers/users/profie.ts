import { Request, Response } from "express";
import { queryUpdatePassword, queryUpdateUserDp, queryUpdateUserNames, queryUserProfile, queryUserSaveDp, queryUserDp } from "../../services/users/user-query-3";
import { CustomSessionData } from "../../types/session-types";
import * as fs from 'fs/promises';
import formidable from 'formidable';

const form = formidable();


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
    };
};

// funcition to haanle user dp upload
const userDpUpload = async (req: Request, res: Response) => {
    try {
        const data: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: Error, formFields: any, formFiles: any) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, files: formFiles });
            });
        });

        const userId = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const file = data.files.dp[0];

        if (!userId || !file) return res.status(400).json({ message: 'Incomplete data sent to server for processing' });

        const imageBuffer = await fs.readFile(file.filepath);
        // @ts-ignore
        const dpExists = await queryUserDp(parseInt(userId));
        let saved;

        if (dpExists) {
            saved = queryUpdateUserDp(userId, imageBuffer);
        } else {
            saved = queryUserSaveDp(userId, imageBuffer);
        };

        if (!saved) throw 'Error saving user dp';

        res.json({ message: 'image uploaded succesfully' });
    } catch (err) {
        console.log('error user image upload', err);
        res.status(500).json({ message: err });
    };
};


// route to retunr user profile pucture 
const getUserDp = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const userDp = await queryUserDp(userId);

        if (!userDp) return res.status(404).json({ message: 'not dp found' });

        userDp.dp = Buffer.from(userDp.dp).toString('base64');

        res.json(userDp);
    } catch (err) {
        console.log('error user image upload', err);
        res.status(500).json({ message: err });
    };
};



export {
    getUserProfileData,
    handleChangePassword,
    handleChangeNames,
    userDpUpload,
    getUserDp,
}