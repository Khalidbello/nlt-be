import { Router, Request, Response, NextFunction } from "express";
import { adminGetCourses, createNewCourse, editCourse, getChaptersData, getCourseData, setCourseStatus } from "../controllers/admin/courses";
import { queryCreateNewCourse } from "../services/admin/course-queries";
import { adminGetLessons, createChapter, getChapter, updateChapter } from "../controllers/admin/course-2";
import { admiGetLessonContent, adminEditLecure, adminGetLessonData, createNewLecture, handleCourseDelete, handleDeleteChapter, requestCourseDelOtp } from "../controllers/admin/courses-3";
import { adminDeleteQuestion, adminEditQuiz, adminGetQuiz, createQuiz } from "../controllers/admin/quiz";
import { CustomSessionData } from "../types/session-types";

const router = Router();


// // check if user has permission
router.use((req: Request, res: Response, next: NextFunction) => {
    if (
        (req.session as CustomSessionData).user?.email && (
            (req.session as CustomSessionData).user?.type === 'admin'
        )) {
        next()
    } else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    };
});






router.post('/create-course', (req: Request, res: Response) => createNewCourse(req, res));

router.post('/set-course-status', (req: Request, res: Response) => setCourseStatus(req, res));

router.post('/edit-course/:courseId', (req: Request, res: Response) => editCourse(req, res));

router.get('/courses/:pagin/:limit', (req: Request, res: Response) => adminGetCourses(req, res));

router.get('/course/:courseId', (req: Request, res: Response) => getCourseData(req, res));

router.get('/chapters/:courseId', (req: Request, res: Response) => getChaptersData(req, res));

router.post('/create-chapter/:courseId', (req: Request, res: Response) => createChapter(req, res));

router.get('/chapter/:courseId/:chapterId', (req: Request, res: Response) => getChapter(req, res));

router.post('/update-chapter/:courseId/:chapterId', (req: Request, res: Response) => updateChapter(req, res));

router.get('/lessons/:courseId/:chapterId', (req: Request, res: Response) => adminGetLessons(req, res));

router.post('/create-lecture/:courseId/:chapterId', (req: Request, res: Response) => createNewLecture(req, res));

router.post('/edit-lecture/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => adminEditLecure(req, res));

router.get('/lesson-data/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => adminGetLessonData(req, res));

router.get('/lesson-content/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => admiGetLessonContent(req, res));

router.post('/create-quiz/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => createQuiz(req, res));

router.post('/edit-quiz/:courseId/:chapterId/:lessonId/:questionId', (req: Request, res: Response) => adminEditQuiz(req, res));

router.get('/quiz/:courseId/:chapterId/:lessonId', (req: Request, res: Response) => adminGetQuiz(req, res));

router.delete('/delete-quiz/:questionId', (req: Request, res: Response) => adminDeleteQuestion(req, res));

router.get('/request-course-del-otp', (req: Request, res: Response) => requestCourseDelOtp(req, res));

router.delete('/delete-course/:courseId/:otp', (req: Request, res: Response) => handleCourseDelete(req, res));

router.delete('/delete-chapter/:chapterId', (req: Request, res: Response) => handleDeleteChapter(req, res));


export default router;