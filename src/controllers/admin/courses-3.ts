import { Request, Response } from "express-serve-static-core";
import * as fs from 'fs/promises';
import { queryAdminCreateLesson, queryAdminLecture, queryAdminLectureExist, queryAdminLectureUpdate, queryChapter } from "../../services/admin/course-queries";
import { queryCourse } from "../../services/users/user-queries";
import emailOtpSender from "../../modules/emailers/email-otp";
import otpGenerator from "../../modules/otp-generator";
import { CustomSessionData } from "../../types/session-types";
import { queryOtp } from "../../services/otp-queries";
import { queryAdminDelChapterByCourseId, queryAdminDelEnrolledDatas, queryAdminDeleteChapterById, queryAdminDeleteCourse, queryAdminDeleteLessonByChapterId, queryAdminDeleteLessonByCourseId } from "../../services/admin/delete-queries";
import formidable from 'formidable';

const form = formidable();

const createNewLecture = async (req: Request, res: Response) => {
    try {
        const data: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: Error, formFields: any, formFiles: any) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, files: formFiles });
            });
        });

        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lecture = data.files.lecture[0];
        const { openingNote, closingNote, lessonNumber, lessonTitle } = data.fields;
        //console.error(openingNote, closingNote, courseId, chapterId, lecture, lessonTitle);

        if (!courseId || !chapterId || !lecture || !openingNote || !closingNote || !lessonNumber || !lessonTitle) return res.status(400).json({ message: 'mcomplete data sent to server for processing.' });

        const lessonExist = await queryAdminLectureExist(courseId, chapterId, lessonNumber[0]);

        if (lessonExist) return res.status(401).json({ message: 'lesson with smae number in this chapter already exist' });

        const chapter = await queryChapter(courseId, chapterId);
        const audio = await fs.readFile(lecture.filepath);
        const lessonCreated = await queryAdminCreateLesson(courseId, chapterId, chapter.chapter_number, lessonNumber[0], lessonTitle[0], openingNote[0], closingNote[0], audio);

        if (!lessonCreated) throw 'something went wrong';

        res.json({ message: 'lesson created successfuly.' });
    } catch (err) {
        console.error('erro rin create new lessons', err);
        res.status(500).json({ mesage: err });
    };
};


// function to get lesson data
const adminGetLessonData = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);

        if (!courseId || !chapterId || !lessonId) return res.status(400).json({ message: 'Incomplete data  sent to server for processing.' });

        const courseData = await queryCourse(courseId);
        const chapterData = await queryChapter(courseId, chapterId);

        if (!courseData || !chapterData) throw 'Something went wrong fetching datas';

        res.json({
            courseName: courseData.course_name,
            chapterTitle: chapterData.chapter_title,
            chapterNumber: chapterData.chapter_number
        });
    } catch (err) {
        console.error('erro in lesson data', err);
        res.status(500).json({ mesage: err });
    };
};


// function to retrieve lecture content
const admiGetLessonContent = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);

        if (!courseId || !chapterId || !lessonId) return res.status(400).json({ message: 'Incomplete data  sent to server for processing.' });

        const lessonData = await queryAdminLecture(courseId, chapterId, lessonId);

        if (!lessonData) return res.json({});

        res.json({
            openingNote: lessonData.opening_note,
            closingNote: lessonData.closing_note,
            lessonNumber: lessonData.lesson_number,
            lessonId: lessonData.lesson_id,
            lessonTitle: lessonData.lesson_title,
            // @ts-ignore
            audio: Buffer.from(lessonData.audio).toString('base64')
        });
    } catch (err) {
        console.error('erro get lesson content', err);
        res.status(500).json({ mesage: err });
    };
};

// function to edit lecture
const adminEditLecure = async (req: Request, res: Response) => {
    try {
        const data: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: Error, formFields: any, formFiles: any) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, files: formFiles });
            });
        });

        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        const lecture = data.files.lecture[0];
        const { lessonNumber, lessonTitle, openingNote, closingNote } = data.fields;

        if (!courseId || !chapterId || !lessonNumber || !lessonNumber || !lessonTitle || !openingNote || !closingNote || !lecture) return res.status(400).json({ message: 'incomplete data sent to server for procesing' });

        const lessonExist = await queryAdminLecture(courseId, chapterId, parseInt(lessonNumber[0]));

        if (lessonExist && lessonExist.lesson_id !== lessonId) return res.status(401).json({ message: 'lesson with number alredy exists' });

        const audio = await fs.readFile(lecture.filepath);
        const updated = await queryAdminLectureUpdate(courseId, chapterId, lessonId, lessonNumber[0], lessonTitle[0], openingNote[0], closingNote[0], audio);

        if (!updated) throw 'erro updting lesson';

        res.json({ message: 'lesson updated successfully' });
    } catch (err) {
        console.error('error admin edit lecture', err);
        res.status(500).json({ mesage: err });
    };
};


// funciton to delete course otp
const requestCourseDelOtp = async (req: Request, res: Response) => {
    try {
        const email = (req.session as CustomSessionData).user?.email;
        const userId = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const opt: number = await otpGenerator(userId);

        // @ts-ignore
        emailOtpSender(email, 'Admin', opt);
        res.json();
    } catch (err) {
        console.error('error sending delete otp', err);
        res.status(500).json({ mesage: err });
    };
};


// function to hnadle course delete
const handleCourseDelete = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const opt = parseInt(req.params.otp);
        const otp = (req.session as CustomSessionData).user?.id;

        // @ts-ignore chaeck if opt is valid
        const actualOtp = await queryOtp(otp);

        if (actualOtp.otp !== opt) return res.status(401).json({ message: 'invalid otp entered.' });

        await queryAdminDeleteCourse(courseId);
        await queryAdminDelChapterByCourseId(courseId);
        await queryAdminDeleteLessonByCourseId(courseId);
        await queryAdminDelEnrolledDatas(courseId);

        res.json();
    } catch (err) {
        console.error('error in handle course delete', err);
        res.status(500).json({ mesage: err });
    };
};


// functioin to handl chapter delete
const handleDeleteChapter = async (req: Request, res: Response) => {
    try {
        const chapterId = parseInt(req.params.chapterId);

        await queryAdminDeleteChapterById(chapterId);
        await queryAdminDeleteLessonByChapterId(chapterId);

        res.json();
    } catch (err) {
        console.error('error deleting otp', err);
        res.status(500).json({ mesage: err });
    }
}

export {
    createNewLecture,
    adminGetLessonData,
    admiGetLessonContent,
    adminEditLecure,
    requestCourseDelOtp,
    handleCourseDelete,
    handleDeleteChapter,
}