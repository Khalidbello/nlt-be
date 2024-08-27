"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controllers/admin/courses");
const course_2_1 = require("../controllers/admin/course-2");
const courses_3_1 = require("../controllers/admin/courses-3");
const quiz_1 = require("../controllers/admin/quiz");
const router = (0, express_1.Router)();
// // check if user has permission
router.use((req, res, next) => {
    var _a, _b;
    if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email) && (((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.type) === 'admin')) {
        next();
    }
    else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    }
    ;
});
router.post('/create-course', (req, res) => (0, courses_1.createNewCourse)(req, res));
router.post('/set-course-status', (req, res) => (0, courses_1.setCourseStatus)(req, res));
router.post('/edit-course/:courseId', (req, res) => (0, courses_1.editCourse)(req, res));
router.get('/courses/:pagin/:limit', (req, res) => (0, courses_1.adminGetCourses)(req, res));
router.get('/course/:courseId', (req, res) => (0, courses_1.getCourseData)(req, res));
router.get('/chapters/:courseId', (req, res) => (0, courses_1.getChaptersData)(req, res));
router.post('/create-chapter/:courseId', (req, res) => (0, course_2_1.createChapter)(req, res));
router.get('/chapter/:courseId/:chapterId', (req, res) => (0, course_2_1.getChapter)(req, res));
router.post('/update-chapter/:courseId/:chapterId', (req, res) => (0, course_2_1.updateChapter)(req, res));
router.get('/lessons/:courseId/:chapterId', (req, res) => (0, course_2_1.adminGetLessons)(req, res));
router.post('/create-lecture/:courseId/:chapterId', (req, res) => (0, courses_3_1.createNewLecture)(req, res));
router.post('/edit-lecture/:courseId/:chapterId/:lessonId', (req, res) => (0, courses_3_1.adminEditLecure)(req, res));
router.get('/lesson-data/:courseId/:chapterId/:lessonId', (req, res) => (0, courses_3_1.adminGetLessonData)(req, res));
router.get('/lesson-content/:courseId/:chapterId/:lessonId', (req, res) => (0, courses_3_1.admiGetLessonContent)(req, res));
router.post('/create-quiz/:courseId/:chapterId/:lessonId', (req, res) => (0, quiz_1.createQuiz)(req, res));
router.post('/edit-quiz/:courseId/:chapterId/:lessonId/:questionId', (req, res) => (0, quiz_1.adminEditQuiz)(req, res));
router.get('/quiz/:courseId/:chapterId/:lessonId', (req, res) => (0, quiz_1.adminGetQuiz)(req, res));
router.delete('/delete-quiz/:questionId', (req, res) => (0, quiz_1.adminDeleteQuestion)(req, res));
router.get('/request-course-del-otp', (req, res) => (0, courses_3_1.requestCourseDelOtp)(req, res));
router.delete('/delete-course/:courseId/:otp', (req, res) => (0, courses_3_1.handleCourseDelete)(req, res));
router.delete('/delete-chapter/:chapterId', (req, res) => (0, courses_3_1.handleDeleteChapter)(req, res));
exports.default = router;
//# sourceMappingURL=admin.js.map