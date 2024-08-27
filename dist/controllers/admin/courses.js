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
exports.setCourseStatus = exports.editCourse = exports.getChaptersData = exports.getCourseData = exports.createNewCourse = exports.adminGetCourses = void 0;
const user_queries_1 = require("../../services/users/user-queries");
const course_queries_1 = require("../../services/admin/course-queries");
const fs = __importStar(require("fs/promises"));
const formidable_1 = __importDefault(require("formidable"));
const form = (0, formidable_1.default)();
// functio to handle creation of new course
const createNewCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new Promise((resolve, reject) => {
            form.parse(req, (err, formFields, formFiles) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, image: formFiles });
            });
        });
        const image = data.image.image[0];
        const { courseName, title, aboutCourse, price, discount } = data.fields;
        if (!image || !courseName || !title || !aboutCourse)
            return res.status(400).json({ message: 'incomplete data sent to server for processing' });
        const imageBuffer = yield fs.readFile(image.filepath);
        const courseSaved = yield (0, course_queries_1.queryCreateNewCourse)(imageBuffer, courseName[0], title[0], aboutCourse[0], parseInt(price[0]), parseInt(discount[0]));
        res.json({ data: courseSaved });
    }
    catch (err) {
        console.error('error in data', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.createNewCourse = createNewCourse;
// function to handle creationof new course
const editCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new Promise((resolve, reject) => {
            form.parse(req, (err, formFields, formFiles) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, image: formFiles });
            });
        });
        const courseId = parseInt(req.params.courseId);
        const image = data.image.image[0];
        const { courseName, title, aboutCourse, price, discount } = data.fields;
        if (!courseId || !image || !courseName || !title || !aboutCourse)
            return res.status(400).json({ message: 'incomplete data sent to server for processing' });
        const imageBuffer = yield fs.readFile(image.filepath);
        const courseUpdated = yield (0, course_queries_1.queryUpdateCourse)(courseId, imageBuffer, courseName[0], title[0], aboutCourse[0], parseInt(price[0]), parseInt(discount[0]));
        if (!courseUpdated)
            throw 'something went wrong updatin course data';
        res.json({ status: courseUpdated });
    }
    catch (err) {
        console.error('error in updating course data', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.editCourse = editCourse;
// function to fetch courses for admin
const adminGetCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.error('in get courses admin.................');
    try {
        const data = [];
        const pagin = parseInt(req.params.pagin);
        const limit = parseInt(req.params.limit);
        const courses = yield (0, course_queries_1.queryAdminCourses)(pagin, limit);
        const length = courses.length;
        for (let i = 0; i < length; i++) {
            const courseId = courses[i].course_id;
            data[i] = {};
            data[i].courseName = courses[i].course_name;
            data[i].courseId = courses[i].course_id;
            data[i].courseDescription = courses[i].course_description;
            data[i].coursetTitle = courses[i].course_title;
            data[i].image = Buffer.from((_a = courses[i]) === null || _a === void 0 ? void 0 : _a.image).toString('base64');
            data[i].numberOfEnrolledStudents = yield (0, user_queries_1.queryCourseEnrolledStudent)(courseId);
            data[i].numberOfLessons = yield (0, user_queries_1.queryCourseLessonNumber)(courseId);
            data[i].numberOfChapters = yield (0, user_queries_1.queryCourseChapterNumber)(courseId);
            data[i].status = courses[i].status;
        }
        ;
        res.json(data);
    }
    catch (err) {
        console.error('error in data', err);
        res.status(500).json({ message: err });
    }
});
exports.adminGetCourses = adminGetCourses;
// functiomn to fetch unit course data 
const getCourseData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const course = yield (0, user_queries_1.queryCourse)(courseId);
        if (!course)
            return res.json({ data: null });
        res.json({
            courseName: course.course_name,
            title: course.course_title,
            aboutCourse: course.course_description,
            price: course.price,
            discount: course.full_price_discount,
            image: Buffer.from(course.image).toString('base64'),
            courseId: course.course_id,
            status: course.status
        });
    }
    catch (err) {
        console.error('error in getCoursedata', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getCourseData = getCourseData;
// function to get chapter with their number of lessons
const getChaptersData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = [];
        const courseId = parseInt(req.params.courseId);
        const chapters = yield (0, user_queries_1.getChapters)(courseId);
        const chaptersLength = chapters.length;
        for (let i = 0; i < chaptersLength; i++) {
            data[i] = {};
            data[i].chapterId = chapters[i].chapter_id;
            data[i].title = chapters[i].chapter_title;
            data[i].chapterNumber = chapters[i].chapter_number;
            data[i].numberOfLessons = yield (0, user_queries_1.querychapterLessonNumber)(chapters[i].chapter_id);
        }
        ;
        res.json(data);
    }
    catch (err) {
        console.error('error in get course chapter', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getChaptersData = getChaptersData;
// function to set course status 
const setCourseStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, status } = req.body;
        if (!courseId || !status)
            return res.status(401).json({ message: 'incomplete data sent to sever for processing.' });
        const updated = yield (0, course_queries_1.queryUpdateCourseStatus)(courseId, status);
        if (!updated)
            throw 'Something went wrong updating course status';
        res.json({ message: 'Course status successfully updated' });
    }
    catch (err) {
        console.error('error in set course status', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.setCourseStatus = setCourseStatus;
//# sourceMappingURL=courses.js.map