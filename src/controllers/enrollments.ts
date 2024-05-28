import { Request, Response } from "express"
import { CustomSessionData } from "../types/session-types"
import { queryNewEnrollment } from "../services/user-queries";


const handleFreeEnroll = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const courseId = parseInt(req.params.courseId);

        if (!userId || !courseId) return res.status(401).json({ message: 'incomplete data sent to server' })

        const result = await queryNewEnrollment(userId, courseId, 'free');

        console.log('in enroll free hNDER', result);
        if (result) return res.json({ mesage: 'enrolld free succesfully' });

        throw 'something went wrong';
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export { handleFreeEnroll }