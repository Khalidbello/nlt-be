import { Request, Response, query } from "express";
import { queryChapter, queryChapterExist, queryCreteChapter, queryUpdateChapter } from "../../services/admin/course-queries";
import { queryCourse, queryLessons, querychapterLessonNumber } from "../../services/users/user-queries";

const createChapter = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const { chapterTitle, chapterNum } = req.body;

        if (!chapterTitle || !chapterNum) return res.status(400).json({ message: 'incompete data sent to server for processing' });

        const chapterExist = await queryChapterExist(courseId, parseInt(chapterNum));

        if (chapterExist) return res.status(401).json({ message: 'chapter  already exist' });

        const chapterCreated = await queryCreteChapter(courseId, chapterTitle, chapterNum);;

        if (!chapterCreated) throw 'something went wrong creating new chapter';

        res.json({ message: 'Chapter creatred sucesfully' });
    } catch (err) {
        console.log('error in creating chapter chapter', err);
        res.status(500).json({ message: err });
    };
};


// functio to get chapter
const getChapter = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const data = {};

        if (!courseId || !chapterId) return res.status(400).json({ message: 'incomplete data sent to server for processing' });

        const chapterData = await queryChapter(courseId, chapterId);

        if (!chapterData) res.status(404).json({ message: 'Chapter not found' });

        const numOfLessons = querychapterLessonNumber(chapterId);
        const courseData = await queryCourse(courseId);

        res.json({
            chapterId: chapterData.chapter_id,
            chapterTitle: chapterData.chapter_title,
            chapterNumber: chapterData.chapter_number,
            numOfLessons: numOfLessons,
            courseName: courseData.course_name
        });
    } catch (err) {
        console.log('error in getting chapter data admin', err);
        res.status(500).json({ message: err });
    };
};


// function to update chapter
const updateChapter = (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const { chapterTitle, chapterNum } = req.body;

        if (!courseId || !chapterId || !chapterNum || !chapterTitle) return res.status(400).json({ message: 'incomplete data sent to server for processing' });

        const updated = queryUpdateChapter(courseId, chapterId, chapterNum, chapterTitle);

        if (!updated) throw 'something went wrong';

        res.json({ status: updated });
    } catch (err) {
        console.log('error in updating course admin...', err);
        res.status(500).json({ message: err });
    };
};


// function to get lessons for admin
const adminGetLessons = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);

        if (!courseId || !chapterId) return res.status(400).json({ message: 'incomplete data sent to server for processing' });

        const lessons = await queryLessons(courseId, chapterId);
       
        res.json({ lessons: lessons });
    } catch (err) {
        console.log('error in geting lessons admin...', err);
        res.status(500).json({ message: err });
    };
};



export {
    createChapter,
    getChapter,
    updateChapter,
    adminGetLessons,
}