import { Request, Response } from "express-serve-static-core";
import * as fs from 'fs/promises';
import { queryAdminCreateLesson, queryAdminLectureExist, queryChapter } from "../../services/admin/course-queries";

const createNewLecture = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        // @ts-ignore
        const lecture = req.file;
        const { openingNote, closingNote, lessonNumber, lessonTitle } = req.body;
        console.log(openingNote, closingNote, courseId, chapterId, lecture, lessonTitle);

        if (!courseId || !chapterId || !lecture || !openingNote || !closingNote || !lessonNumber || !lessonTitle) return res.status(400).json({ message: 'mcomplete data sent to server for processing.' });

        const lessonExist = await queryAdminLectureExist(courseId, chapterId, lessonNumber);

        if (lessonExist) return res.status(401).json({ message: 'lesson with smae number in this chapter already exist' });

        const chapter = await queryChapter(courseId, chapterId);
        const audio = await fs.readFile(lecture.path);
        const lessonCreated = await queryAdminCreateLesson(courseId, chapterId, chapter.chapter_number, lessonNumber, lessonTitle, openingNote, closingNote, audio);

        if (!lessonCreated) throw 'something went wrong';

        res.json({ message: 'lesson created successfuly.' });
    } catch (err) {
        console.log('erro rin create new lessons', err);
        res.status(500).json({ mesage: err });
    };
};


export {
    createNewLecture
}