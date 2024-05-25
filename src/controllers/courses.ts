import { Request, Response, query } from "express"
import { CustomSessionData } from "../types/session-types";
import {
    queryRecentcourse,
    queryCourses,
    queryEnrolled,
    queryCourseEnrolledStudent,
    queryEnrolledCourses,
    queryLessons,
    recentType,
    enrolledType,
    queryCourse,
    courseType
} from "../services/user-queries";
import calcProgress, { calcProgressType } from "../modules/course-progress-calc";
import { getLecture } from "./course2";

const continueLast = async (req: Request, res: Response) => {
    try {
        const email = (req.session as CustomSessionData).user?.email;
        const userId = (req.session as CustomSessionData).user?.id;
        let enrolledData: enrolledType; // variablr to hold course enrolled data
        let courseData: courseType; // variable to hold course data
        const recent: recentType = await queryRecentcourse(email);  // get recent course_id and dates from user table

        if (!recent.recent_course_id) return res.json({ data: null, messag: 'no recent course' });

        enrolledData = await queryEnrolled(recent.user_id, recent.recent_course_id);
        courseData = await queryCourse(recent.recent_course_id);

        // @ts-ignore
        const details: calcProgressType = await calcProgress(userId, recent.recent_course_id)

        console.log('detals', details);

        res.json({
            data: {
                courseName: courseData.course_name,
                title: courseData.course_title,
                courseId: recent.recent_course_id,
                lastVisited: recent.recent_course_date,
                chapter: details.currentChapter,
                lesson: details.currentLesson,
                progress: details.percentageCompletion,
            },
            message: 'fethed succesfully'
        });
    } catch (err) {
        console.log('error in get most recent courses courses', err)
        res.status(500).json({ message: err });
    }
};

interface coursesType extends courseType {
    lessonNumber: number;
    chapterNumber: number;
    enrolledStudents: number;
    isEnrolled: boolean;
    lastVisited: string;
    progress: number;
    image: string;
}

const getCourses = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const { pagin, limit } = req.params;
        //@ts-ignore
        const courses: coursesType[] = await queryCourses(parseInt(pagin), parseInt(limit));
        const length: number = courses.length;

        // get courses number of nrolled students number of chapters and number of lessons
        for (let i = 0; i < length; i++) {
            const courseId: number = courses[i].course_id;
            // @ts-ignore
            const details: calcProgressType = await calcProgress(userId, courses[i].course_id);

            courses[i].chapterNumber = details.numOfChapter;
            courses[i].lessonNumber = details.numOfLessons;
            courses[i].isEnrolled = details.enrolled;
            courses[i].lastVisited = details.lastVisited;
            courses[i].progress = details.percentageCompletion;
            courses[i].image = '/images/e-learning-1.jpg';
            courses[i].enrolledStudents = await queryCourseEnrolledStudent(courseId);
        };

        res.json({
            data: courses,
            message: 'courses fethced succesfully'
        })
    } catch (err) {
        console.log('error in get courses', err)
        res.status(500).json({ message: err });
    }
};

const getEnrolledCourses = async (req: Request, res: Response) => {
    try {
        const { pagin, limit } = req.params;
        const userId = (req.session as CustomSessionData).user?.id;
        let courses: coursesType[] = []
        // @ts-ignore
        const enrolledCourses: enrolledType[] = await queryEnrolledCourses(userId, parseInt(pagin), parseInt(limit));

        for (let i = 0; i < enrolledCourses.length; i++) {
            const course: courseType = await queryCourse(enrolledCourses[i].course_id);
            // @ts-ignore
            courses.push(course);
        };

        for (let i = 0; i < courses.length;) {
            const courseId: number = courses[i].course_id;
            // @ts-ignore
            const details: calcProgressType = await calcProgress(userId, courses[i].course_id);

            courses[i].chapterNumber = details.numOfChapter;
            courses[i].lessonNumber = details.numOfLessons;
            courses[i].isEnrolled = details.enrolled;
            courses[i].lastVisited = details.lastVisited;
            courses[i].progress = details.percentageCompletion;
            courses[i].image = '/images/e-learning-1.jpg';
            courses[i].enrolledStudents = await queryCourseEnrolledStudent(courseId);
            i++;
        };

        res.json({
            data: courses,
            message: 'courses fethced succesfully'
        })
    } catch (err) {
        console.log('error in get enrolled courses courses', err)
        res.status(500).json({ message: err });
    }
};


const getCourseView = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const { courseId } = req.params;
        const courseData: courseType = await queryCourse(parseInt(courseId));
        // @ts-ignore
        const details: calcProgressType = await calcProgress(parseInt(userId), parseInt(courseId))


        res.json({
            courseName: courseData.course_name,
            about: courseData.course_description,
            enrolled: details.enrolled,
            quizPerfomace: details.quiz,
            progress: details.percentageCompletion,
            currentChapter: details.currentChapter,
            currentLesson: details.currentLesson,
            currentChapterId: details.currentChapterId,
            chapters: details.chapters,
            lessonNumbers: details.lessonNumbers,
        })
    } catch (err) {
        console.log('error get course view...........', err)
        res.status(500).json({ message: err });
    }
};


const getLesson = async (req: Request, res: Response) => {
    try {
        const { courseId, chapterId } = req.params;

        const lessons = await queryLessons(parseInt(courseId), parseInt(chapterId));

        res.json({
            message: 'succesfull',
            data: lessons
        })
    } catch (err) {
        console.log('error in get lessons...........', err)
        res.status(500).json({ message: err });
    }
}


export {
    continueLast,
    getCourses,
    getEnrolledCourses,
    getCourseView,
    getLesson,
    getLecture
};