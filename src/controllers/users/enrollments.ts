import { Request, Response } from "express"
import { CustomSessionData } from "../../types/session-types"
import { queryLessonByChapterAndNUmber, queryNewEnrollment } from "../../services/users/user-queries";


const handleFreeEnroll = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const courseId = parseInt(req.params.courseId);

        if (!userId || !courseId) return res.status(401).json({ message: 'incomplete data sent to server' })

        // get course current lesson id and chapter id
        const courseData = await queryLessonByChapterAndNUmber(courseId, 1, 1)
        const result = await queryNewEnrollment(userId, courseId, 'free', courseData.chapter_id, courseData.lesson_id);

        console.log('in enroll free hNDER', result);
        if (result) return res.json({ mesage: 'enrolld free succesfully' });

        throw 'something went wrong';
    } catch (err) {
        console.log('error in enroll for free', err);
        res.status(500).json({ error: err });
    }
}

export { handleFreeEnroll }