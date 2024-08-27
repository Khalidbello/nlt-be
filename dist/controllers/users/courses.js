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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursePrice = exports.handleQuizSubmission = exports.getQuiz = exports.getLecture = exports.getLesson = exports.getCourseView = exports.getEnrolledCourses = exports.getCourses = exports.continueLast = void 0;
const user_queries_1 = require("../../services/users/user-queries");
const course_progress_calc_1 = __importDefault(require("../../modules/course-progress-calc"));
const course2_1 = require("./course2");
Object.defineProperty(exports, "getLecture", { enumerable: true, get: function () { return course2_1.getLecture; } });
Object.defineProperty(exports, "getQuiz", { enumerable: true, get: function () { return course2_1.getQuiz; } });
Object.defineProperty(exports, "handleQuizSubmission", { enumerable: true, get: function () { return course2_1.handleQuizSubmission; } });
Object.defineProperty(exports, "getCoursePrice", { enumerable: true, get: function () { return course2_1.getCoursePrice; } });
const continueLast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        // @ts-ignore
        let enrolledData = yield (0, user_queries_1.queryRecentcourse)(userId); // get recent course_id and dates from user table
        let courseData; // variable to hold course data
        if (!enrolledData)
            return res.json({ data: null, messag: 'no recent course' });
        courseData = yield (0, user_queries_1.queryCourse)(enrolledData.course_id);
        // @ts-ignore
        const details = yield (0, course_progress_calc_1.default)(userId, enrolledData.course_id);
        console.error('details', details);
        res.json({
            data: {
                courseName: courseData.course_name,
                title: courseData.course_title,
                courseId: enrolledData.course_id,
                lastVisited: enrolledData.last_visited,
                chapter: details.currentChapter,
                lesson: details.currentLesson,
                progress: details.percentageCompletion,
                completed: details.completed,
            },
            message: 'fethed succesfully'
        });
    }
    catch (err) {
        console.error('error in get most recent courses courses', err);
        res.status(500).json({ message: err });
    }
});
exports.continueLast = continueLast;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
        const { pagin, limit } = req.params;
        //@ts-ignore
        const courses = yield (0, user_queries_1.queryCourses)(parseInt(pagin), parseInt(limit));
        const length = courses.length;
        // get courses number of nrolled students number of chapters and number of lessons
        for (let i = 0; i < length; i++) {
            const courseId = courses[i].course_id;
            // @ts-ignore
            const details = yield (0, course_progress_calc_1.default)(userId, courses[i].course_id);
            courses[i].chapterNumber = details.numOfChapter;
            courses[i].lessonNumber = details.numOfLessons;
            courses[i].isEnrolled = details.enrolled;
            courses[i].lastVisited = details.lastVisited;
            courses[i].progress = details.percentageCompletion;
            courses[i].image = Buffer.from(courses[i].image).toString('base64');
            courses[i].enrolledStudents = yield (0, user_queries_1.queryCourseEnrolledStudent)(courseId);
            courses[i].completed = details.completed;
        }
        ;
        res.json({
            data: courses,
            message: 'courses fethced succesfully'
        });
    }
    catch (err) {
        console.error('error in get courses', err);
        res.status(500).json({ message: err });
    }
});
exports.getCourses = getCourses;
const getEnrolledCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { pagin, limit } = req.params;
        const userId = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id;
        let courses = [];
        // @ts-ignore
        const enrolledCourses = yield (0, user_queries_1.queryEnrolledCourses)(userId, parseInt(pagin), parseInt(limit));
        for (let i = 0; i < enrolledCourses.length; i++) {
            const course = yield (0, user_queries_1.queryCourse)(enrolledCourses[i].course_id);
            // @ts-ignore
            courses.push(course);
        }
        ;
        for (let i = 0; i < courses.length;) {
            const courseId = courses[i].course_id;
            // @ts-ignore
            const details = yield (0, course_progress_calc_1.default)(userId, courses[i].course_id);
            courses[i].chapterNumber = details.numOfChapter;
            courses[i].lessonNumber = details.numOfLessons;
            courses[i].isEnrolled = details.enrolled;
            courses[i].lastVisited = details.lastVisited;
            courses[i].progress = details.percentageCompletion;
            courses[i].image = Buffer.from(courses[i].image).toString('base64');
            courses[i].enrolledStudents = yield (0, user_queries_1.queryCourseEnrolledStudent)(courseId);
            i++;
        }
        ;
        res.json({
            data: courses,
            message: 'courses fethced succesfully'
        });
    }
    catch (err) {
        console.error('error in get enrolled courses courses', err);
        res.status(500).json({ message: err });
    }
});
exports.getEnrolledCourses = getEnrolledCourses;
const getCourseView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = (_d = req.session.user) === null || _d === void 0 ? void 0 : _d.id;
        const { courseId } = req.params;
        if (!userId || !courseId)
            return res.status(401).json({ message: 'insuficient data sent to user' });
        const courseData = yield (0, user_queries_1.queryCourse)(parseInt(courseId));
        // set image
        courseData.image = Buffer.from(courseData.image).toString('base64');
        // @ts-ignore
        const details = yield (0, course_progress_calc_1.default)(parseInt(userId), parseInt(courseId));
        res.json({
            courseName: courseData.course_name,
            courseId: courseData.course_id,
            about: courseData.course_description,
            enrolled: details.enrolled,
            image: courseData.image,
            status: courseData.status,
            quizPerfomace: details.quiz,
            progress: details.percentageCompletion,
            currentChapter: details.currentChapter,
            currentLesson: details.currentLesson,
            currentChapterId: details.currentChapterId,
            chapters: details.chapters,
            lessonNumbers: details.lessonNumbers,
            completed: details.completed,
            reviewed: details.reviewed,
        });
        // update the course last visted if user has enrolled for course
        if (details.enrolled) {
            const recentUpdate = yield (0, user_queries_1.updateLastVisited)(userId, parseInt(courseId));
            console.error('last visited updated..........', recentUpdate);
        }
    }
    catch (err) {
        console.error('error get course view...........', err);
        res.status(500).json({ message: err });
    }
});
exports.getCourseView = getCourseView;
const getLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, chapterId } = req.params;
        const lessons = yield (0, user_queries_1.queryLessons)(parseInt(courseId), parseInt(chapterId));
        res.json({
            message: 'succesfull',
            data: lessons
        });
    }
    catch (err) {
        console.error('error in get lessons...........', err);
        res.status(500).json({ message: err });
    }
});
exports.getLesson = getLesson;
//# sourceMappingURL=courses.js.map