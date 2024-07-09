import { Request, Response } from "express";
import { getChapters, queryCourse, queryCourseChapterNumber, queryCourseEnrolledStudent, queryCourseLessonNumber, querychapterLessonNumber } from "../../services/users/user-queries";
import { queryAdminCourses, queryCreateNewCourse, queryUpdateCourse, queryUpdateCourseStatus } from "../../services/admin/course-queries";
import * as fs from 'fs/promises';
import formidable from 'formidable';

const form = formidable();


// functio to handle creation of new course
const createNewCourse = async (req: Request, res: Response) => {
    try {
        const data: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: Error, formFields: any, formFiles: any) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, image: formFiles });
            });
        });

        const image = data.image.image[0]
        const { courseName, title, aboutCourse, price, discount } = data.fields;

        if (!image || !courseName || !title || !aboutCourse) return res.status(400).json({ message: 'incomplete data sent to server for processing' });

        const imageBuffer = await fs.readFile(image.filepath);
        const courseSaved = await queryCreateNewCourse(imageBuffer, courseName[0], title[0], aboutCourse[0], parseInt(price[0]), parseInt(discount[0]));

        res.json({ data: courseSaved })
    } catch (err) {
        console.error('error in data', err);
        res.status(500).json({ message: err });
    };
};


// function to handle creationof new course
const editCourse = async (req: Request, res: Response) => {
    try {
        const data: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: Error, formFields: any, formFiles: any) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, image: formFiles });
            });
        });

        const courseId = parseInt(req.params.courseId);
        const image = data.image.image[0];
        const { courseName, title, aboutCourse, price, discount } = data.fields;

        if (!courseId || !image || !courseName || !title || !aboutCourse) return res.status(400).json({ message: 'incomplete data sent to server for processing' });

        const imageBuffer = await fs.readFile(image.filepath);
        const courseUpdated = await queryUpdateCourse(courseId, imageBuffer, courseName[0], title[0], aboutCourse[0], parseInt(price[0]), parseInt(discount[0]));

        if (!courseUpdated) throw 'something went wrong updatin course data';

        res.json({ status: courseUpdated });
    } catch (err) {
        console.error('error in updating course data', err);
        res.status(500).json({ message: err });
    };
};

// function to fetch courses for admin
const adminGetCourses = async (req: Request, res: Response) => {
    console.error('in get courses admin.................')
    try {
        const data: any = [];
        const pagin = parseInt(req.params.pagin);
        const limit = parseInt(req.params.limit);

        const courses = await queryAdminCourses(pagin, limit);
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
            data[i].status = courses[i].status;
        };


        res.json(data);
    } catch (err) {
        console.error('error in data', err);
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
            courseId: course.course_id,
            status: course.status
        });
    } catch (err) {
        console.error('error in getCoursedata', err);
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
            data[i].chapterNumber = chapters[i].chapter_number;
            data[i].numberOfLessons = await querychapterLessonNumber(chapters[i].chapter_id);
        };

        res.json(data);
    } catch (err) {
        console.error('error in get course chapter', err);
        res.status(500).json({ message: err });
    };
};


// function to set course status 
const setCourseStatus = async (req: Request, res: Response) => {
    try {
        const { courseId, status } = req.body;
        if (!courseId || !status) return res.status(401).json({ message: 'incomplete data sent to sever for processing.' });

        const updated = await queryUpdateCourseStatus(courseId, status);

        if (!updated) throw 'Something went wrong updating course status';
        res.json({ message: 'Course status successfully updated' });
    } catch (err) {
        console.error('error in set course status', err);
        res.status(500).json({ message: err });
    };
};

export {
    adminGetCourses,
    createNewCourse,
    getCourseData,
    getChaptersData,
    editCourse,
    setCourseStatus,
}