import { Request, Response } from "express";
import { queryUserProfile } from "../services/user-query-3";
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


export { getUserProfileData }