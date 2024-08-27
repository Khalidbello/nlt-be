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
exports.getCoursePrice = exports.handleQuizSubmission = exports.getQuiz = exports.getLecture = void 0;
const user_queries_1 = require("../../services/users/user-queries");
const enrolled_queries_1 = require("../../services/users/enrolled-queries");
const user_query_3_1 = require("../../services/users/user-query-3");
const getLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = parseInt((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id);
        const courseId = parseInt(req.params.courseId);
        const chapterNumber = parseInt(req.params.chapterNumber);
        const lessonNumber = parseInt(req.params.lessonNumber);
        const chapterId = parseInt(req.params.chapterId);
        if (!userId || !courseId || !chapterId || !chapterNumber || !lessonNumber)
            throw 'incomplete data sent to server';
        // heck if user is enrolled and has reached to view this course
        const enrolled = yield (0, user_queries_1.queryEnrolled)(userId, courseId);
        const numberOfChapters = yield (0, user_queries_1.queryCourseChapterNumber)(courseId);
        if (!enrolled || !enrolled.payment_type) {
            res.status(402).json({
                message: 'user has not enrolled for course yet',
                status: 'notEnrolled'
            });
            return;
        }
        else if (enrolled.payment_type === 'free') {
            // check if requesng lesson is only from chapter one
            if (chapterNumber > 1) {
                return res.status(401).json({ status: 'endOfFree' });
            }
            else {
                return getLectureHelper(res, userId, courseId, enrolled.current_chapter_number, enrolled.current_lesson_number, chapterNumber, chapterId, lessonNumber);
            }
        }
        else if (enrolled.payment_type === 'half') {
            const halfCourseLenght = Math.floor(numberOfChapters / 2);
            if (chapterNumber > halfCourseLenght)
                return res.status(401).json({ status: 'makeFullPayment' });
            return getLectureHelper(res, userId, courseId, enrolled.current_chapter_number, enrolled.current_lesson_number, chapterNumber, chapterId, lessonNumber);
        }
        else if (enrolled.payment_type === 'full') {
            return getLectureHelper(res, userId, courseId, enrolled.current_chapter_number, enrolled.current_lesson_number, chapterNumber, chapterId, lessonNumber);
        }
        ;
        throw 'somthing went wrong yeah its here';
    }
    catch (err) {
        console.error('error in get lectures...........', err);
        res.status(500).json({ message: err });
    }
});
exports.getLecture = getLecture;
// helper function to handle sending course and updating current leson and chapter
const getLectureHelper = (res, userId, courseId, currentChapterNumber, currentLessonNumber, requestedChapterNumber, requestedChapterId, requestedLessonNumber) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(
    //     courseId,
    //     currentChapterNumber,
    //     currentLessonNumber,
    //     requestedChapterNumber,
    //     requestedChapterId,
    //     requestedLessonNumber
    // )
    if (currentChapterNumber > requestedChapterNumber) {
        return fetchLesson(res, courseId, requestedChapterNumber, requestedLessonNumber, currentChapterNumber, currentLessonNumber, userId);
    }
    else if (currentChapterNumber === requestedChapterNumber && currentLessonNumber >= requestedLessonNumber) {
        return fetchLesson(res, courseId, requestedChapterNumber, requestedLessonNumber, currentChapterNumber, currentLessonNumber, userId);
    }
    else {
        // user can not view content
        res.status(401).json({
            status: 'accessDenied'
        });
    }
});
// helper 2 tofech lesson 
const fetchLesson = (res, courseId, chapterNumber, lessonNumber, currentChapter, currentLesson, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield (0, user_queries_1.queryCourse)(courseId);
    const lecture = yield (0, user_queries_1.queryLecture)(courseId, chapterNumber, lessonNumber);
    //@ts-ignore
    lecture.course_name = courseData.course_name;
    // @ts-ignore
    lecture.audio = Buffer.from(lecture.audio).toString('base64');
    res.json({
        messsage: 'success',
        data: lecture
    });
});
// function  to get quiz for a particular lesson
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        if (!userId || !courseId || !chapterId || !lessonId)
            throw 'incomplete data sent to server';
        // @ts-ignore fist check if user has enrolled for course
        const enrolled = yield (0, user_queries_1.queryEnrolled)(userId, courseId);
        if (!enrolled.current_lesson_number)
            return res.status(402).json({ status: 'accessDenied' });
        const quiz = yield (0, user_queries_1.queryQuiz)(courseId, chapterId, lessonId);
        res.json({
            message: 'succesfull',
            quiz: quiz
        });
    }
    catch (err) {
        console.error('error in get lectures...........', err);
        res.status(500).json({ message: err });
    }
});
exports.getQuiz = getQuiz;
// function to handle quiz submission and update user current lesson and chapter
const handleQuizSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id;
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        const { percentage } = req.body;
        let nextLessonNumber;
        let nextchapterNumber;
        if (!userId || !courseId || !chapterId || !lessonId || !percentage)
            throw 'incomplete data sent to server';
        //@ts-ignore
        const enrolled = yield (0, user_queries_1.queryEnrolled)(userId, courseId);
        if (!enrolled.current_lesson_number)
            return res.status(403).json({ message: 'user is not enrolled for this course' });
        const numOfLessonInChapter = yield (0, user_queries_1.querychapterLessonNumber)(chapterId);
        const lessonData = yield (0, user_queries_1.queryByLessonId)(courseId, chapterId, lessonId);
        nextLessonNumber = lessonData.lesson_number + 1;
        nextchapterNumber = lessonData.chapter_number;
        // first check i fuser has done lesson before
        if (enrolled.current_chapter_number > nextchapterNumber || (enrolled.current_chapter_number === nextchapterNumber && enrolled.current_lesson_number > nextLessonNumber)) {
            // no need to carry out any update has user have alredy done course before
            // check if the lesson is the last lesson in the chapter if true send first lesson in next chapter
            if (nextLessonNumber > numOfLessonInChapter) {
                nextLessonNumber = 1;
                nextchapterNumber = lessonData.chapter_number + 1;
            }
            ;
            //console.log(courseId, nextchapterNumber, nextLessonNumber, 'in quiz submit')
            const lesson = yield (0, user_queries_1.queryLessonByChapterAndNUmber)(courseId, nextchapterNumber, nextLessonNumber);
            res.json({
                courseId: courseId,
                chapterId: lesson.chapter_id,
                chapterNumber: nextchapterNumber,
                lessonNumber: nextLessonNumber
            });
            return;
        }
        ;
        if (nextLessonNumber > numOfLessonInChapter) {
            nextLessonNumber = 1;
            nextchapterNumber = lessonData.chapter_number + 1;
            const numOfChapterInCourse = yield (0, user_queries_1.queryCourseChapterNumber)(courseId);
            if (nextchapterNumber > numOfChapterInCourse) {
                // user has completed course 
                // update user enrolled......
                const updated = yield (0, enrolled_queries_1.queryCourseCompletion)(userId, courseId);
                if (!updated)
                    throw 'error updating user completion';
                const courseData = yield (0, user_queries_1.queryCourse)(courseId);
                const userData = yield (0, user_query_3_1.queryUserProfile)(userId);
                // make query to get  currentChapterId, nextLessonId
                const lesson = yield (0, user_queries_1.queryLessonByChapterAndNUmber)(courseId, nextchapterNumber - 1, numOfLessonInChapter);
                // update user enrollment data
                const updated2 = yield (0, user_queries_1.updateUserEnrolledCurrentLessonAndChapter)(userId, courseId, lesson.chapter_id, lesson.lesson_id, nextchapterNumber - 1, numOfLessonInChapter, (percentage + enrolled.quiz_performance) / 2);
                if (!updated2)
                    throw 'error updating user course progress';
                return res.json({
                    status: 'completed',
                    courseName: courseData.course_name,
                    userName: userData.first_name,
                });
            }
            ;
        }
        ;
        // make query to get  currentChapterId, nextLessonId
        const lesson = yield (0, user_queries_1.queryLessonByChapterAndNUmber)(courseId, nextchapterNumber, nextLessonNumber);
        // update user enrollment data
        const update = yield (0, user_queries_1.updateUserEnrolledCurrentLessonAndChapter)(userId, courseId, lesson.chapter_id, lesson.lesson_id, nextchapterNumber, nextLessonNumber, (percentage + enrolled.quiz_performance) / 2);
        //@ts-ignore
        if (update) {
            res.json({
                courseId: courseId,
                chapterId: lesson.chapter_id,
                chapterNumber: nextchapterNumber,
                lessonNumber: nextLessonNumber
            });
            return;
        }
        ;
        throw 'somthig went wromg';
    }
    catch (err) {
        console.error('error in get submit quiz...........', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.handleQuizSubmission = handleQuizSubmission;
// handler toge course price
const getCoursePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const courseData = yield (0, user_queries_1.queryCourse)(courseId);
        res.json({
            price: courseData.price,
            discount: courseData.full_price_discount
        });
    }
    catch (err) {
        console.error('error in get submit quiz...........', err);
        res.status(500).json({ message: err });
    }
});
exports.getCoursePrice = getCoursePrice;
//# sourceMappingURL=course2.js.map