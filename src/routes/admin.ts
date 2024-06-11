import { Router, Request, Response } from "express";
import { adminGetCourses, createNewCourse, editCourse, getChaptersData, getCourseData } from "../controllers/admin/courses";
import { queryCreateNewCourse } from "../services/admin/course-queries";
import { createChapter, getChapter, updateChapter } from "../controllers/admin/course-2";
const multer = require("multer");

const router = Router();

//const upload = multer({ dest: '/uploads' });

// router.use((req, res, next) => {
//     console.log(req.headers);
//     console.log(req.body);
//     next();
// });


const upload = multer({ dest: '/uploads' });

// Create endpoint to handle file upload
router.post('/create-course', upload.single('image'), (req: Request, res: Response) => createNewCourse(req, res));

router.post('/edit-course/:courseId', upload.single('image'), (req: Request, res: Response) => editCourse(req, res));

router.get('/courses/:pagin/:limit', (req: Request, res: Response) => adminGetCourses(req, res));

router.get('/course/:courseId', (req: Request, res: Response) => getCourseData(req, res));

router.get('/chapters/:courseId', (req: Request, res: Response) => getChaptersData(req, res));

router.post('/create-chapter/:courseId', (req: Request, res: Response) => createChapter(req, res));

router.get('/chapter/:courseId/:chapterId', (req: Request, res: Response) => getChapter(req, res));

router.post('/update-chapter/:courseId/:chapterId', (req: Request, res: Response) => updateChapter(req, res));


export default router;