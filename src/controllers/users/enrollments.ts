import { Request, Response } from "express"
import { CustomSessionData } from "../../types/session-types"
import { queryCourse, queryLessonByChapterAndNUmber, queryNewEnrollment } from "../../services/users/user-queries";
import { queryAddNewNotification } from "../../services/users/notificaion-queries";


const handleFreeEnroll = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const courseId = parseInt(req.params.courseId);

        if (!userId || !courseId) return res.status(401).json({ message: 'incomplete data sent to server' })

        const courseInfo = await queryCourse(courseId);
        // get course current lesson id and chapter id
        const courseData = await queryLessonByChapterAndNUmber(courseId, 1, 1)
        const result = await queryNewEnrollment(userId, courseId, 'free', courseData.chapter_id, courseData.lesson_id);

        const message = 'Free enrollment for ' + courseInfo.course_name.toUpperCase() + ' succesfull.'
        await queryAddNewNotification(userId, message, 'info');

        if (result) return res.json({ mesage: 'enrolld free succesfully' });

        throw 'something went wrong';
    } catch (err) {
        console.error('error in enroll for free', err);
        res.status(500).json({ error: err });
    };
};

export { handleFreeEnroll }