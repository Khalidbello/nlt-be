import { CustomSessionData } from "../types/session-types";
import { Request, Response } from "express";
import {
    enrolledType,
    queryCourseChapterNumber,
    queryEnrolled,
    queryLecture,
    querychapterLessonNumber,
    updateCurrentLessonAndChapter,
} from "../services/user-queries";



const getLecture = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = parseInt((req.session as CustomSessionData).user?.id);
        const courseId: number = parseInt(req.params.courseId);
        const chapterNumber: number = parseInt(req.params.chapterNumber);
        const lessonNumber: number = parseInt(req.params.lessonNumber);
        const chapterId: number = parseInt(req.params.chapterId);
        console.log('params..............', userId, req.params)

        // heck if user is enrolled and has reached to view this course
        const enrolled: enrolledType = await queryEnrolled(userId, courseId);
        const numberOfChapters: number = await queryCourseChapterNumber(courseId)

        if (!enrolled || !enrolled.payment_type) {
            res.status(402).json({
                message: 'user has not enrolled for course yet',
                status: 'notEnrolled'
            });
            return;
        } else if (enrolled.payment_type === 'free') {
            // check if requesng lesson is only from chapter one
            if (chapterNumber > 1) {
                return res.status(403).json({ status: 'freeOfFree' });
            } else {
                return getLectureHelper(res, userId, courseId, enrolled.current_chapter_number, enrolled.current_lesson_number, chapterNumber, chapterId, lessonNumber);
            }
        } else if (enrolled.payment_type === 'half') {
            const halfCourseLenght: number = Math.floor(numberOfChapters / 2);

            if (chapterNumber > halfCourseLenght) {
                return res.status(403).json({ status: 'makeFullPayment' });
            }
        } else if (enrolled.payment_type === 'full') {
            return getLectureHelper(res, userId, courseId, enrolled.current_chapter_number, enrolled.current_lesson_number, chapterNumber, chapterId, lessonNumber);
        }
        throw 'somthing went wrong';
    } catch (err) {
        console.log('error in get lectures...........', err)
        res.status(500).json({ message: err });
    }
};

// helper function to handle sending course and updating current leson and chapter

const getLectureHelper = async (
    res: Response,
    userId: number,
    courseId: number,
    currentChapterNumber: number,
    currentLessonNumber: number,
    requestedChapterNumber: number,
    requestedChapterId: number,
    requestedLessonNumber: number
) => {
    console.log(
        courseId,
        currentChapterNumber,
        currentLessonNumber,
        requestedChapterNumber,
        requestedChapterId,
        requestedLessonNumber
    )
    if (currentChapterNumber >= requestedChapterNumber) {
        // get thr number oflessons in the chapter been requested
        const lengthOfLessons: number = await querychapterLessonNumber(requestedChapterId);

        if (lengthOfLessons >= requestedLessonNumber) {
            // make sure user can view the next lesson they are requesting
            if (currentLessonNumber >= requestedLessonNumber - 1) {
                return fetchLesson(res, courseId, requestedChapterNumber, requestedLessonNumber, currentChapterNumber, currentLessonNumber, userId);
            } else {
                return res.json({ status: 'accessDenied', currentLessonNumber, requestedLessonNumber, lengthOfLessons });
            };
        } else if ((requestedLessonNumber - currentLessonNumber) > 1) {
            res.json({ status: 'accessDenied' });
        } else {
            // send user first lesson of the next chapter
            const nextChapterNum: number = requestedChapterId + 1;
            const chaptersLength: number = await queryCourseChapterNumber(courseId); // to store the number of cahpters in course
            console.log('nextChapterNum', nextChapterNum, 'chaptersLength', chaptersLength, 'requestedChapterNumber', requestedChapterNumber)

            if (chaptersLength >= nextChapterNum) {
                return fetchLesson(res, courseId, nextChapterNum, 1, currentChapterNumber, currentLessonNumber, userId); // send back to user first lesson of next chapter
            } else if (nextChapterNum > chaptersLength) {
                return res.json({ status: 'finished' });
            }
        };
    } else {
        // user can not view content
        res.json({
            status: 'notAvailable'
        });
    }
};


// helper 2 tofech lesson 
const fetchLesson = async (res: Response, courseId: number, chapterNumber: number, lessonNumber: number, currentChapter: number, currentLesson: number, userId: number) => {
    const lecture = await queryLecture(courseId, chapterNumber, lessonNumber);

    // check if requeated resource index higehr than current if so update
    if (chapterNumber > currentChapter || (currentChapter === chapterNumber && lessonNumber > currentLesson)) {
        console.log('update enroled...................... lecture', lessonNumber, currentLesson, lecture);
        await updateCurrentLessonAndChapter(userId, courseId, chapterNumber, lessonNumber, lecture.lesson_id)
    };

    res.json({
        messsage: 'success',
        data: lecture
    })
};


export {
    getLecture
}