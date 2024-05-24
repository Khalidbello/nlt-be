import { Router, Request, Response, NextFunction } from "express";
import {
    continueLast,
    getCourses,
    getEnrolledCourses,
    getCourseView,
} from "../controllers/courses";
import { CustomSessionData } from "../types/session-types";

const router = Router();

// check if user has permission
router.use((req: Request, res: Response, next: NextFunction) => {
    if (
        (req.session as CustomSessionData).user?.email && (
            (req.session as CustomSessionData).user?.type === 'normal' ||
            (req.session as CustomSessionData).user?.type === 'admin' ||
            (req.session as CustomSessionData).user?.type === 'super'
        )) {
        next()
    } else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    };
});


router.get('/continue-last', (req: Request, res: Response) => continueLast(req, res))

router.get('/courses/:pagin/:limit', (req: Request, res: Response) => getCourses(req, res))

router.get('/enrolled-courses/:pagin/:limit', (req: Request, res: Response) => getEnrolledCourses(req, res));

router.get('/course-view/:courseId', (req: Request, res: Response) => getCourseView(req, res));

// router.post('/change-email', (req: Request, res: Response)=> changeEmail(req, res));

// router.post('/change-password')

export default router;