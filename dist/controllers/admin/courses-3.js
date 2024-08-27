"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteChapter = exports.handleCourseDelete = exports.requestCourseDelOtp = exports.adminEditLecure = exports.admiGetLessonContent = exports.adminGetLessonData = exports.createNewLecture = void 0;
const fs = __importStar(require("fs/promises"));
const course_queries_1 = require("../../services/admin/course-queries");
const user_queries_1 = require("../../services/users/user-queries");
const email_otp_1 = __importDefault(require("../../modules/emailers/email-otp"));
const otp_generator_1 = __importDefault(require("../../modules/otp-generator"));
const otp_queries_1 = require("../../services/otp-queries");
const delete_queries_1 = require("../../services/admin/delete-queries");
const formidable_1 = __importDefault(require("formidable"));
const form = (0, formidable_1.default)();
const createNewLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new Promise((resolve, reject) => {
            form.parse(req, (err, formFields, formFiles) => {
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
        if (!courseId || !chapterId || !lecture || !openingNote || !closingNote || !lessonNumber || !lessonTitle)
            return res.status(400).json({ message: 'mcomplete data sent to server for processing.' });
        const lessonExist = yield (0, course_queries_1.queryAdminLectureExist)(courseId, chapterId, lessonNumber[0]);
        if (lessonExist)
            return res.status(401).json({ message: 'lesson with smae number in this chapter already exist' });
        const chapter = yield (0, course_queries_1.queryChapter)(courseId, chapterId);
        const audio = yield fs.readFile(lecture.filepath);
        const lessonCreated = yield (0, course_queries_1.queryAdminCreateLesson)(courseId, chapterId, chapter.chapter_number, lessonNumber[0], lessonTitle[0], openingNote[0], closingNote[0], audio);
        if (!lessonCreated)
            throw 'something went wrong';
        res.json({ message: 'lesson created successfuly.' });
    }
    catch (err) {
        console.error('erro rin create new lessons', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.createNewLecture = createNewLecture;
// function to get lesson data
const adminGetLessonData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        if (!courseId || !chapterId || !lessonId)
            return res.status(400).json({ message: 'Incomplete data  sent to server for processing.' });
        const courseData = yield (0, user_queries_1.queryCourse)(courseId);
        const chapterData = yield (0, course_queries_1.queryChapter)(courseId, chapterId);
        if (!courseData || !chapterData)
            throw 'Something went wrong fetching datas';
        res.json({
            courseName: courseData.course_name,
            chapterTitle: chapterData.chapter_title,
            chapterNumber: chapterData.chapter_number
        });
    }
    catch (err) {
        console.error('erro in lesson data', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.adminGetLessonData = adminGetLessonData;
// function to retrieve lecture content
const admiGetLessonContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        if (!courseId || !chapterId || !lessonId)
            return res.status(400).json({ message: 'Incomplete data  sent to server for processing.' });
        const lessonData = yield (0, course_queries_1.queryAdminLecture)(courseId, chapterId, lessonId);
        if (!lessonData)
            return res.json({});
        res.json({
            openingNote: lessonData.opening_note,
            closingNote: lessonData.closing_note,
            lessonNumber: lessonData.lesson_number,
            lessonId: lessonData.lesson_id,
            lessonTitle: lessonData.lesson_title,
            // @ts-ignore
            audio: Buffer.from(lessonData.audio).toString('base64')
        });
    }
    catch (err) {
        console.error('erro get lesson content', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.admiGetLessonContent = admiGetLessonContent;
// function to edit lecture
const adminEditLecure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new Promise((resolve, reject) => {
            form.parse(req, (err, formFields, formFiles) => {
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
        if (!courseId || !chapterId || !lessonNumber || !lessonNumber || !lessonTitle || !openingNote || !closingNote || !lecture)
            return res.status(400).json({ message: 'incomplete data sent to server for procesing' });
        const lessonExist = yield (0, course_queries_1.queryAdminLecture)(courseId, chapterId, parseInt(lessonNumber[0]));
        if (lessonExist && lessonExist.lesson_id !== lessonId)
            return res.status(401).json({ message: 'lesson with number alredy exists' });
        const audio = yield fs.readFile(lecture.filepath);
        const updated = yield (0, course_queries_1.queryAdminLectureUpdate)(courseId, chapterId, lessonId, lessonNumber[0], lessonTitle[0], openingNote[0], closingNote[0], audio);
        if (!updated)
            throw 'erro updting lesson';
        res.json({ message: 'lesson updated successfully' });
    }
    catch (err) {
        console.error('error admin edit lecture', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.adminEditLecure = adminEditLecure;
// funciton to delete course otp
const requestCourseDelOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email;
        const userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
        // @ts-ignore
        const opt = yield (0, otp_generator_1.default)(userId);
        // @ts-ignore
        (0, email_otp_1.default)(email, 'Admin', opt);
        res.json();
    }
    catch (err) {
        console.error('error sending delete otp', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.requestCourseDelOtp = requestCourseDelOtp;
// function to hnadle course delete
const handleCourseDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const courseId = parseInt(req.params.courseId);
        const opt = parseInt(req.params.otp);
        const otp = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id;
        // @ts-ignore chaeck if opt is valid
        const actualOtp = yield (0, otp_queries_1.queryOtp)(otp);
        if (actualOtp.otp !== opt)
            return res.status(401).json({ message: 'invalid otp entered.' });
        yield (0, delete_queries_1.queryAdminDeleteCourse)(courseId);
        yield (0, delete_queries_1.queryAdminDelChapterByCourseId)(courseId);
        yield (0, delete_queries_1.queryAdminDeleteLessonByCourseId)(courseId);
        yield (0, delete_queries_1.queryAdminDelEnrolledDatas)(courseId);
        res.json();
    }
    catch (err) {
        console.error('error in handle course delete', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.handleCourseDelete = handleCourseDelete;
// functioin to handl chapter delete
const handleDeleteChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapterId = parseInt(req.params.chapterId);
        yield (0, delete_queries_1.queryAdminDeleteChapterById)(chapterId);
        yield (0, delete_queries_1.queryAdminDeleteLessonByChapterId)(chapterId);
        res.json();
    }
    catch (err) {
        console.error('error deleting otp', err);
        res.status(500).json({ mesage: err });
    }
});
exports.handleDeleteChapter = handleDeleteChapter;
//# sourceMappingURL=courses-3.js.map