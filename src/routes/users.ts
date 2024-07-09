import { Router, Request, Response, NextFunction } from "express";
import {
    continueLast,
    getCourses,
    getEnrolledCourses,
    getCourseView,
    getLesson,
    getLecture,
    getQuiz,
    handleQuizSubmission,
    getCoursePrice,
} from "../controllers/users/courses";
import { getUserDp, getUserProfileData, handleChangeNames, handleChangePassword, userDpUpload } from "../controllers/users/profie";
import { CustomSessionData } from "../types/session-types";
import { handleFreeEnroll } from "../controllers/users/enrollments";
import { confirmEmailOtp, generateConfirmEmailOtp, getCheckEmailVerify } from "../controllers/users/email-verification";
import { checkUnViewedNotiication, getNotifications, setNotToViewed } from "../controllers/users/notification";
import { NewsLetter } from "../controllers/users/news-letter";
import { getReviews, getUserDpforReview, reviewSubmitted } from "../controllers/users/reviews";

const router = Router();


// news letter route
router.post('/news-letter', (req: Request, res: Response) => NewsLetter(req, res));

// route to fetch custmre review for landig page
router.get('/reviews/:pagin/:limit', (req: Request, res: Response) => getReviews(req, res));

// review user dp
router.get('/user-review-dp/:userId', (req: Request, res: Response) => getUserDpforReview(req, res));


// check if user has permission
router.use((req: Request, res: Response, next: NextFunction) => {
    if (
        (req.session as CustomSessionData).user?.email && (
            (req.session as CustomSessionData).user?.type === 'normal'
        )) {
        next()
    } else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    };
});

router.get('/profile', (req: Request, res: Response) => getUserProfileData(req, res));

router.get('/continue-last', (req: Request, res: Response) => continueLast(req, res))

router.get('/courses/:pagin/:limit', (req: Request, res: Response) => getCourses(req, res))

router.get('/enrolled-courses/:pagin/:limit', (req: Request, res: Response) => getEnrolledCourses(req, res));

router.get('/course-view/:courseId', (req: Request, res: Response) => getCourseView(req, res));

// route for reivew submission
router.post('/review-submit', (req: Request, res: Response) => reviewSubmitted(req, res));

router.get('/lessons/:chapterId/:courseId', (req: Request, res: Response) => getLesson(req, res));

router.get('/lecture/:courseId/:chapterId/:chapterNumber/:lessonNumber', (req: Request, res: Response) => getLecture(req, res));

router.get('/quiz/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => getQuiz(req, res));

router.put('/quiz-submit/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => handleQuizSubmission(req, res));

router.get('/profile-data', (req: Request, res: Response) => getUserProfileData(req, res));

router.get('/get-price/:courseId', (req: Request, res: Response) => getCoursePrice(req, res));

// route to handle free course enrollment
router.get('/enroll-free/:courseId', (req: Request, res: Response) => handleFreeEnroll(req, res));


// user profile related

router.post('/edit-dp', (req: Request, res: Response) => userDpUpload(req, res));

router.get('/check-email-verify', (req: Request, res: Response) => getCheckEmailVerify(req, res));

router.post('/confirm-email-otp', (req: Request, res: Response) => confirmEmailOtp(req, res));

router.post('/send-email-confirm-otp', (req: Request, res: Response) => generateConfirmEmailOtp(req, res));

router.post('/change-password', (req: Request, res: Response) => handleChangePassword(req, res));

router.post('/change-names', (req: Request, res: Response) => handleChangeNames(req, res));

router.get('/user-dp', (req: Request, res: Response) => getUserDp(req, res));


// notification related 

router.get('/unviewed-notification', (req: Request, res: Response) => checkUnViewedNotiication(req, res));

router.get('/notifications/:limit/:pagin', (req: Request, res: Response) => getNotifications(req, res));

router.get('/update-notification', (req: Request, res: Response) => setNotToViewed(req, res));

// log out route
router.get('/logout', (req: Request, res: Response) => {
    try {
        req.session.destroy(() => {
            res.json({ message: 'Logged out' });
        });
    } catch (err) {
        console.log('erorr loging out');
        res.status(500).json({ message: 'Failed to logout' });
    }
})

export default router;