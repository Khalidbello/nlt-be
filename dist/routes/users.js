"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controllers/users/courses");
const profie_1 = require("../controllers/users/profie");
const enrollments_1 = require("../controllers/users/enrollments");
const email_verification_1 = require("../controllers/users/email-verification");
const notification_1 = require("../controllers/users/notification");
const news_letter_1 = require("../controllers/users/news-letter");
const reviews_1 = require("../controllers/users/reviews");
const router = (0, express_1.Router)();
// news letter route
router.post('/news-letter', (req, res) => (0, news_letter_1.NewsLetter)(req, res));
// route to fetch custmre review for landig page
router.get('/reviews/:pagin/:limit', (req, res) => (0, reviews_1.getReviews)(req, res));
// review user dp
router.get('/user-review-dp/:userId', (req, res) => (0, reviews_1.getUserDpforReview)(req, res));
// check if user has permission
router.use((req, res, next) => {
    var _a, _b;
    if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email) && (((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.type) === 'normal')) {
        next();
    }
    else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    }
    ;
});
router.get('/profile', (req, res) => (0, profie_1.getUserProfileData)(req, res));
router.get('/continue-last', (req, res) => (0, courses_1.continueLast)(req, res));
router.get('/courses/:pagin/:limit', (req, res) => (0, courses_1.getCourses)(req, res));
router.get('/enrolled-courses/:pagin/:limit', (req, res) => (0, courses_1.getEnrolledCourses)(req, res));
router.get('/course-view/:courseId', (req, res) => (0, courses_1.getCourseView)(req, res));
// route for reivew submission
router.post('/review-submit', (req, res) => (0, reviews_1.reviewSubmitted)(req, res));
router.get('/lessons/:chapterId/:courseId', (req, res) => (0, courses_1.getLesson)(req, res));
router.get('/lecture/:courseId/:chapterId/:chapterNumber/:lessonNumber', (req, res) => (0, courses_1.getLecture)(req, res));
router.get('/quiz/:courseId/:chapterId/:lessonId', (req, res) => (0, courses_1.getQuiz)(req, res));
router.put('/quiz-submit/:courseId/:chapterId/:lessonId', (req, res) => (0, courses_1.handleQuizSubmission)(req, res));
router.get('/profile-data', (req, res) => (0, profie_1.getUserProfileData)(req, res));
router.get('/get-price/:courseId', (req, res) => (0, courses_1.getCoursePrice)(req, res));
// route to handle free course enrollment
router.get('/enroll-free/:courseId', (req, res) => (0, enrollments_1.handleFreeEnroll)(req, res));
// user profile related
router.post('/edit-dp', (req, res) => (0, profie_1.userDpUpload)(req, res));
router.get('/check-email-verify', (req, res) => (0, email_verification_1.getCheckEmailVerify)(req, res));
router.post('/confirm-email-otp', (req, res) => (0, email_verification_1.confirmEmailOtp)(req, res));
router.post('/send-email-confirm-otp', (req, res) => (0, email_verification_1.generateConfirmEmailOtp)(req, res));
router.post('/change-password', (req, res) => (0, profie_1.handleChangePassword)(req, res));
router.post('/change-names', (req, res) => (0, profie_1.handleChangeNames)(req, res));
router.get('/user-dp', (req, res) => (0, profie_1.getUserDp)(req, res));
// notification related 
router.get('/unviewed-notification', (req, res) => (0, notification_1.checkUnViewedNotiication)(req, res));
router.get('/notifications/:limit/:pagin', (req, res) => (0, notification_1.getNotifications)(req, res));
router.get('/update-notification', (req, res) => (0, notification_1.setNotToViewed)(req, res));
// log out route
router.get('/logout', (req, res) => {
    try {
        req.session.destroy(() => {
            res.json({ message: 'Logged out' });
        });
    }
    catch (err) {
        console.log('erorr loging out');
        res.status(500).json({ message: 'Failed to logout' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map