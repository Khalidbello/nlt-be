import { Request, Response, query } from "express"
import { CustomSessionData } from "../types/session-types";
import {
    queryRecentcourse,
    queryCourses,
    getChapters,
    querychapterLessonNumber,
    queryEnrolled,
    queryCourseLessonNumber,
    queryCourseChapterNumber,
    queryCourseEnrolledStudent,
    recentType,
    chaptersType,
    enrolledType,
    queryCourse,
    courseType
} from "../services/user-queries";

const continueLast = async (req: Request, res: Response) => {
    try {
        const email = (req.session as CustomSessionData).user?.email;
        const lessonNumbers: { [key: number]: number } = {};
        let totalLessonNumber: number = 0;
        let completedLessonNumber: number = 0;
        let percentageCompletion: number = 0;
        let enrolledData: enrolledType; // variablr to hold course enrolled data
        let courseData: courseType; // variable to hold course data
        const recent: recentType = await queryRecentcourse(email);  // get recent course_id and dates from user table

        if (!recent.recent_course_id) return res.json({ data: null, messag: 'no recent course' });

        enrolledData = await queryEnrolled(recent.user_id, recent.recent_course_id);
        courseData = await queryCourse(recent.recent_course_id);

        // get all chapters ordered by chapter number
        const chapters: chaptersType[] = await getChapters(recent.recent_course_id); // ordered in accordanc with chapter number
        console.log(chapters, 'chapters.......')

        for (let index = 0; index < chapters.length; index++) {
            console.log('chapter detals', chapters[index]);
            const lessonNumber: number = await querychapterLessonNumber(chapters[index].chapter_id);
            lessonNumbers[chapters[index].chapter_number] = lessonNumber;
            totalLessonNumber += lessonNumber;
        };
        console.log('lesson numbers..............', lessonNumbers);

        // get where user stopped in course from error
        console.log(enrolledData, 'enrolled data.......');

        // get lesson completed
        for (let i = 1; i < enrolledData.current_chapter_number + 1; i++) {
            console.log('in last loop', i);
            if (i === enrolledData.current_chapter_number) {
                console.log(lessonNumbers[i], enrolledData.current_lesson_number, 'ahv d/.............');
                completedLessonNumber += enrolledData.current_lesson_number - 1;
            } else {
                completedLessonNumber += lessonNumbers[i];
            };
        };

        // calculate percentage
        percentageCompletion = (completedLessonNumber / totalLessonNumber) * 100;

        console.log(completedLessonNumber, totalLessonNumber, percentageCompletion, 'complted, total, percentage');

        res.json({
            courseName: courseData.course_name,
            title: courseData.course_title,
            courseId: recent.recent_course_id,
            chapter: enrolledData.current_lesson_number,
            lesson: enrolledData.current_lesson_number,
            lastVisited: recent.recent_course_date,
            progress: percentageCompletion,
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
}
const getCourses = async (req: Request, res: Response) => {
    try {
        const { pagin, limit } = req.params;
        //@ts-ignore
        const courses: coursesType[] = await queryCourses(parseInt(pagin), parseInt(limit));
        const length: number = courses.length;

        // get courses number of nrolled students number of chapters and number of lessons
        for (let i = 0; i < length; i++) {
            const courseId: number = courses[i].course_id;

            courses[i].lessonNumber = await queryCourseLessonNumber(courseId);
            courses[i].chapterNumber = await queryCourseChapterNumber(courseId);
            courses[i].enrolledStudents = await queryCourseEnrolledStudent(courseId)
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

const getEnrolledCourses = (req: Request, res: Response) => {
    try {

    } catch (err) {

    }
};

export {
    continueLast,
    getCourses,
    getEnrolledCourses
};