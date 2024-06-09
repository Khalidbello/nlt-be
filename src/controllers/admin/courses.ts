import { Request, Response } from "express";
import { getChapters, queryCourse, queryCourseChapterNumber, queryCourseEnrolledStudent, queryCourseLessonNumber, queryCourses, queryEnrolled, queryLessons, querychapterLessonNumber } from "../../services/users/user-queries";
import { queryCreateNewCourse } from "../../services/admin/course-queries";
import * as fs from 'fs/promises';


// functio to handle creation of new course
const createNewCourse = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const image = req.file!;
        const { courseName, title, aboutCourse, price, discount } = req.body;
        console.log('datas........', image, courseName, title, aboutCourse, price, discount);

        if (!image || !courseName || !title || !aboutCourse) return res.status(400).json({ message: 'No image uploaded' });


        const imageBuffer = await fs.readFile(image.path);
        const courseSaved = await queryCreateNewCourse(imageBuffer, courseName, title, aboutCourse, parseInt(price), parseInt(discount));

        res.json({ data: courseSaved })
    } catch (err) {
        console.log('error in data', err);
        res.status(500).json({ message: err });
    }
}

const adminGetCourses = async (req: Request, res: Response) => {
    console.log('in get courses admin.................')
    try {
        const data: any = [];
        const pagin = parseInt(req.params.pagin);
        const limit = parseInt(req.params.limit);

        const courses = await queryCourses(pagin, limit);
        const length = courses.length;

        for (let i = 0; i < length; i++) {
            const courseId = courses[i].course_id;
            data[i] = {};

            data[i].courseName = courses[i].course_name;
            data[i].courseId = courses[i].course_id;
            data[i].courseDescription = courses[i].course_description;
            data[i].coursetTitle = courses[i].course_title;
            data[i].image = Buffer.from(courses[i]?.image).toString('base64')
            data[i].numberOfEnrolledStudents = await queryCourseEnrolledStudent(courseId);
            data[i].numberOfLessons = await queryCourseLessonNumber(courseId);
            data[i].numberOfChapters = await queryCourseChapterNumber(courseId);
        };


        res.json(data);
    } catch (err) {
        console.log('error in data', err);
        res.status(500).json({ message: err });
    }
};


// functiomn to fetch unit course data 
const getCourseData = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);

        const course = await queryCourse(courseId);

        if (!course) return res.json({ data: null });

        res.json({
            courseName: course.course_name,
            title: course.course_title,
            aboutCourse: course.course_description,
            price: course.price,
            discount: course.full_price_discount,
            image: Buffer.from(course.image).toString('base64'),
        });
    } catch (err) {
        console.log('error in getCoursedata', err);
        res.status(500).json({ message: err });
    };
};



// function to get chapter with their number of lessons
const getChaptersData = async (req: Request, res: Response) => {
    try {
        const data: any[] = [];
        const courseId = parseInt(req.params.courseId);

        const chapters = await getChapters(courseId);
        const chaptersLength = chapters.length;

        for (let i = 0; i < chaptersLength; i++) {
            data[i] = {};
            data[i].chapterId = chapters[i].chapter_id;
            data[i].title = chapters[i].chapter_title;
            data[i].numberOfLessons = await querychapterLessonNumber(chapters[i].chapter_id);
        };

        res.json(data);
    } catch (err) {
        console.log('error in get course chapter', err);
        res.status(500).json({ message: err });
    };
};


export {
    adminGetCourses,
    createNewCourse,
    getCourseData,
    getChaptersData
}