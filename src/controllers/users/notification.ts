import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryUserCountUnViewedNoti, queryUserNotifications } from "../../services/users/notificaion-queries";

const checkUnViewedNotiication = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const notificationExists = await queryUserCountUnViewedNoti(userId);

        if (!notificationExists) return res.json({ status: false });

        res.json({ status: true });
    } catch (err) {
        console.error('an error occured check if notification exists', err);
        res.status(500).json({ message: err });
    };
};


const getNotifications = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const limit = parseInt(req.params.limit);
        const pagin = parseInt(req.params.pagin);

        const notificaions = await queryUserNotifications(userId, limit, pagin);

        res.json(notificaions);
    } catch (err) {
        console.error('an error occured fetch lessons', err);
        res.status(500).json({ message: err });
    };
};

export {
    checkUnViewedNotiication,
    getNotifications,
}