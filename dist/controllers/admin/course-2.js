"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGetLessons = exports.updateChapter = exports.getChapter = exports.createChapter = void 0;
const course_queries_1 = require("../../services/admin/course-queries");
const user_queries_1 = require("../../services/users/user-queries");
const createChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const { chapterTitle, chapterNum } = req.body;
        if (!chapterTitle || !chapterNum)
            return res.status(400).json({ message: 'incompete data sent to server for processing' });
        const chapterExist = yield (0, course_queries_1.queryChapterExist)(courseId, parseInt(chapterNum));
        if (chapterExist)
            return res.status(401).json({ message: 'chapter  already exist' });
        const chapterCreated = yield (0, course_queries_1.queryCreteChapter)(courseId, chapterTitle, chapterNum);
        ;
        if (!chapterCreated)
            throw 'something went wrong creating new chapter';
        res.json({ message: 'Chapter creatred sucesfully' });
    }
    catch (err) {
        console.error('error in creating chapter chapter', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.createChapter = createChapter;
// functio to get chapter
const getChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const data = {};
        if (!courseId || !chapterId)
            return res.status(400).json({ message: 'incomplete data sent to server for processing' });
        const chapterData = yield (0, course_queries_1.queryChapter)(courseId, chapterId);
        if (!chapterData)
            res.status(404).json({ message: 'Chapter not found' });
        const numOfLessons = (0, user_queries_1.querychapterLessonNumber)(chapterId);
        const courseData = yield (0, user_queries_1.queryCourse)(courseId);
        res.json({
            chapterId: chapterData.chapter_id,
            chapterTitle: chapterData.chapter_title,
            chapterNumber: chapterData.chapter_number,
            numOfLessons: numOfLessons,
            courseName: courseData.course_name
        });
    }
    catch (err) {
        console.error('error in getting chapter data admin', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getChapter = getChapter;
// function to update chapter
const updateChapter = (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const { chapterTitle, chapterNum } = req.body;
        if (!courseId || !chapterId || !chapterNum || !chapterTitle)
            return res.status(400).json({ message: 'incomplete data sent to server for processing' });
        const updated = (0, course_queries_1.queryUpdateChapter)(courseId, chapterId, chapterNum, chapterTitle);
        if (!updated)
            throw 'something went wrong';
        const lessonChaptNumUpdate = (0, course_queries_1.queryLessonChapNumUpdate)(courseId, chapterId, chapterNum);
        if (!lessonChaptNumUpdate)
            throw 'something went wrong';
        res.json({ status: updated });
    }
    catch (err) {
        console.error('error in updating course admin...', err);
        res.status(500).json({ message: err });
    }
    ;
};
exports.updateChapter = updateChapter;
// function to get lessons for admin
const adminGetLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        if (!courseId || !chapterId)
            return res.status(400).json({ message: 'incomplete data sent to server for processing' });
        const lessons = yield (0, user_queries_1.queryLessons)(courseId, chapterId);
        res.json({ lessons: lessons });
    }
    catch (err) {
        console.error('error in geting lessons admin...', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.adminGetLessons = adminGetLessons;
//# sourceMappingURL=course-2.js.map