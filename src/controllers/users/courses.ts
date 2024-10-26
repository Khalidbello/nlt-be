import { Request, Response, query } from "express";
import { CustomSessionData } from "../../types/session-types";
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
  courseType,
  updateLastVisited,
  queryCourseImage,
} from "../../services/users/user-queries";
import calcProgress, {
  calcProgressType,
} from "../../modules/course-progress-calc";
import {
  getLecture,
  getQuiz,
  handleQuizSubmission,
  getCoursePrice,
} from "./course2";

const continueLast = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSessionData).user?.id;
    //@ts-expect-error
    let enrolledData: enrolledType = await queryRecentcourse(userId); // get recent course_id and dates from user table
    let courseData: courseType; // variable to hold course data

    if (!enrolledData)
      return res.json({ data: null, messag: "no recent course" });

    courseData = await queryCourse(enrolledData.course_id);

    const details: calcProgressType = await calcProgress(
      //@ts-expect-error
      userId,
      enrolledData.course_id
    );

    res.json({
      data: {
        courseName: courseData.course_name,
        title: courseData.course_title,
        courseId: enrolledData.course_id,
        lastVisited: enrolledData.last_visited,
        chapter: details.currentChapter,
        lesson: details.currentLesson,
        progress: details.percentageCompletion,
        completed: details.completed,
      },
      message: "fethed succesfully",
    });
  } catch (err) {
    console.error("error in get most recent courses courses", err);
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
  course_id: number;
  completed: boolean;
}

const getCourses = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSessionData).user?.id;
    const { pagin, limit } = req.params;
    //@ts-expect-error
    const courses: coursesType[] = await queryCourses(
      parseInt(pagin),
      parseInt(limit)
    );
    const length: number = courses.length;

    // get courses number of nrolled students number of chapters and number of lessons
    for (let i = 0; i < length; i++) {
      const courseId: number = courses[i].course_id;
      const details: calcProgressType = await calcProgress(
        //@ts-expect-error
        userId,
        courses[i].course_id
      );

      courses[i].chapterNumber = details.numOfChapter;
      courses[i].lessonNumber = details.numOfLessons;
      courses[i].isEnrolled = details.enrolled;
      courses[i].lastVisited = details.lastVisited;
      courses[i].progress = details.percentageCompletion;
      //courses[i].image = Buffer.from(courses[i].image).toString('base64');
      courses[i].enrolledStudents = await queryCourseEnrolledStudent(courseId);
      courses[i].completed = details.completed;
    }

    res.json({
      data: courses,
      message: "courses fethced succesfully",
    });
  } catch (err) {
    console.error("error in get courses", err);
    res.status(500).json({ message: err });
  }
};

// fuction to fetch course image
const getCourseImage = async (req: Request, res: Response) => {
  try {
    const image = await queryCourseImage(parseInt(req.params.course_id));
    const base64Image = Buffer.from(image[0].image).toString("base64");

    res.json({ image: base64Image });
  } catch (err) {
    console.error("error occured n fetching course image", err);
    res.status(500).json({ message: err });
  }
};

const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const { pagin, limit } = req.params;
    const userId = (req.session as CustomSessionData).user?.id;
    let courses: coursesType[] = [];
    const enrolledCourses: enrolledType[] = await queryEnrolledCourses(
      //@ts-expect-error
      userId,
      parseInt(pagin),
      parseInt(limit)
    );

    for (let i = 0; i < enrolledCourses.length; i++) {
      const course: courseType = await queryCourse(
        enrolledCourses[i].course_id
      );
      //@ts-expect-error
      courses.push(course);
    }

    for (let i = 0; i < courses.length; ) {
      const courseId: number = courses[i].course_id;
      const details: calcProgressType = await calcProgress(
        //@ts-expect-error
        userId,
        courses[i].course_id
      );

      courses[i].chapterNumber = details.numOfChapter;
      courses[i].lessonNumber = details.numOfLessons;
      courses[i].isEnrolled = details.enrolled;
      courses[i].lastVisited = details.lastVisited;
      courses[i].progress = details.percentageCompletion;
      courses[i].enrolledStudents = await queryCourseEnrolledStudent(courseId);
      i++;
    }

    res.json({
      data: courses,
      message: "courses fethced succesfully",
    });
  } catch (err) {
    console.error("error in get enrolled courses courses", err);
    res.status(500).json({ message: err });
  }
};

const getCourseView = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSessionData).user?.id;
    const { courseId } = req.params;

    if (!userId || !courseId)
      return res.status(401).json({ message: "insuficient data sent to user" });

    const courseData: courseType = await queryCourse(parseInt(courseId));
    const details: calcProgressType = await calcProgress(
      //@ts-expect-error
      parseInt(userId),
      parseInt(courseId)
    );

    res.json({
      courseName: courseData.course_name,
      courseId: courseData.course_id,
      about: courseData.course_description,
      enrolled: details.enrolled,
      status: courseData.status,
      quizPerfomace: details.quiz,
      progress: details.percentageCompletion,
      currentChapter: details.currentChapter,
      currentLesson: details.currentLesson,
      currentChapterId: details.currentChapterId,
      chapters: details.chapters,
      lessonNumbers: details.lessonNumbers,
      completed: details.completed,
      reviewed: details.reviewed,
    });
    // update the course last visted if user has enrolled for course

    if (details.enrolled) {
      const recentUpdate: boolean = await updateLastVisited(
        userId,
        parseInt(courseId)
      );
      //console.log('last visited updated..........', recentUpdate);
    }
  } catch (err) {
    console.error("error get course view...........", err);
    res.status(500).json({ message: err });
  }
};

const getLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, chapterId } = req.params;

    const lessons = await queryLessons(parseInt(courseId), parseInt(chapterId));

    res.json({
      message: "succesfull",
      data: lessons,
    });
  } catch (err) {
    console.error("error in get lessons...........", err);
    res.status(500).json({ message: err });
  }
};

export {
  continueLast,
  getCourses,
  getCourseImage,
  getEnrolledCourses,
  getCourseView,
  getLesson,
  getLecture,
  getQuiz,
  handleQuizSubmission,
  getCoursePrice,
};
