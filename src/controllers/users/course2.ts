import { CustomSessionData } from "../../types/session-types";
import { Request, Response } from "express";
import {
  enrolledType,
  queryCourseChapterNumber,
  queryEnrolled,
  queryLecture,
  querychapterLessonNumber,
  updateCurrentLessonAndChapter,
  queryQuiz,
  queryQuizType,
  courseType,
  queryCourse,
  queryLessons,
  queryByLessonId,
  queryLessonByChapterAndNUmber,
  updateUserEnrolledCurrentLessonAndChapter,
} from "../../services/users/user-queries";
import { queryCourseCompletion } from "../../services/users/enrolled-queries";
import { getCourseData } from "../admin/courses";
import { queryUserProfile } from "../../services/users/user-query-3";

const getLecture = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId: number = parseInt(
      // @ts-expect-error
      (req.session as CustomSessionData).user?.id
    );
    const courseId: number = parseInt(req.params.courseId);
    const chapterNumber: number = parseInt(req.params.chapterNumber);
    const lessonNumber: number = parseInt(req.params.lessonNumber);
    const chapterId: number = parseInt(req.params.chapterId);

    if (!userId || !courseId || !chapterId || !chapterNumber || !lessonNumber)
      throw "incomplete data sent to server";

    // heck if user is enrolled and has reached to view this course
    const enrolled: enrolledType = await queryEnrolled(userId, courseId);
    const numberOfChapters: number = await queryCourseChapterNumber(courseId);

    if (!enrolled || !enrolled.payment_type) {
      res.status(402).json({
        message: "user has not enrolled for course yet",
        status: "notEnrolled",
      });

      return;
    } else if (enrolled.payment_type === "free") {
      // check if requesng lesson is only from chapter one
      if (chapterNumber > 1) {
        return res.status(401).json({ status: "endOfFree" });
      } else {
        return getLectureHelper(
          res,
          userId,
          courseId,
          enrolled.current_chapter_number,
          enrolled.current_lesson_number,
          chapterNumber,
          chapterId,
          lessonNumber
        );
      }
    } else if (enrolled.payment_type === "half") {
      const halfCourseLenght: number = Math.floor(numberOfChapters / 2);

      if (chapterNumber > halfCourseLenght)
        return res.status(401).json({ status: "makeFullPayment" });

      return getLectureHelper(
        res,
        userId,
        courseId,
        enrolled.current_chapter_number,
        enrolled.current_lesson_number,
        chapterNumber,
        chapterId,
        lessonNumber
      );
    } else if (enrolled.payment_type === "full") {
      return getLectureHelper(
        res,
        userId,
        courseId,
        enrolled.current_chapter_number,
        enrolled.current_lesson_number,
        chapterNumber,
        chapterId,
        lessonNumber
      );
    }

    throw "somthing went wrong yeah its here";
  } catch (err) {
    console.error("error in get lectures...........", err);
    res.status(500).json({ message: err });
  }
};

// helper function to handle sending course and updating current leson and chapter

const getLectureHelper = async (
  res: Response,
  userId: number,
  courseId: number,
  currentChapterNumber: number,
  currentLessonNumber: number,
  requestedChapterNumber: number,
  requestedChapterId: number,
  requestedLessonNumber: number
) => {
  // console.log(
  //     courseId,
  //     currentChapterNumber,
  //     currentLessonNumber,
  //     requestedChapterNumber,
  //     requestedChapterId,
  //     requestedLessonNumber
  // )
  if (currentChapterNumber > requestedChapterNumber) {
    return fetchLesson(
      res,
      courseId,
      requestedChapterNumber,
      requestedLessonNumber,
      currentChapterNumber,
      currentLessonNumber,
      userId
    );
  } else if (
    currentChapterNumber === requestedChapterNumber &&
    currentLessonNumber >= requestedLessonNumber
  ) {
    return fetchLesson(
      res,
      courseId,
      requestedChapterNumber,
      requestedLessonNumber,
      currentChapterNumber,
      currentLessonNumber,
      userId
    );
  } else {
    // user can not view content
    res.status(401).json({
      status: "accessDenied",
    });
  }
};

// helper 2 tofech lesson
const fetchLesson = async (
  res: Response,
  courseId: number,
  chapterNumber: number,
  lessonNumber: number,
  currentChapter: number,
  currentLesson: number,
  userId: number
) => {
  const courseData: courseType = await queryCourse(courseId);
  const lecture = await queryLecture(courseId, chapterNumber, lessonNumber);
  //@ts-ignore
  lecture.course_name = courseData.course_name;
  // @ts-ignore
  lecture.audio = Buffer.from(lecture.audio).toString("base64");

  res.json({
    messsage: "success",
    data: lecture,
  });
};

// function  to get quiz for a particular lesson
const getQuiz = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSessionData).user?.id;
    const courseId = parseInt(req.params.courseId);
    const chapterId = parseInt(req.params.chapterId);
    const lessonId = parseInt(req.params.lessonId);

    if (!userId || !courseId || !chapterId || !lessonId)
      throw "incomplete data sent to server";

    // @ts-ignore fist check if user has enrolled for course
    const enrolled: enrolledType = await queryEnrolled(userId, courseId);

    if (!enrolled.current_lesson_number)
      return res.status(402).json({ status: "accessDenied" });

    const quiz: queryQuizType[] = await queryQuiz(
      courseId,
      chapterId,
      lessonId
    );

    res.json({
      message: "succesfull",
      quiz: quiz,
    });
  } catch (err) {
    console.error("error in get lectures...........", err);
    res.status(500).json({ message: err });
  }
};

// function to handle quiz submission and update user current lesson and chapter
const handleQuizSubmission = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSessionData).user?.id;
    const courseId = parseInt(req.params.courseId);
    const chapterId = parseInt(req.params.chapterId);
    const lessonId = parseInt(req.params.lessonId);
    const { percentage, noQuiz } = req.body;
    let nextLessonNumber: number;
    let nextchapterNumber: number;

    if (!userId || !courseId || !chapterId || !lessonId || !percentage)
      throw "incomplete data sent to server";

    //@ts-ignore
    const enrolled: enrolledType = await queryEnrolled(userId, courseId);

    if (!enrolled.current_lesson_number)
      return res
        .status(403)
        .json({ message: "user is not enrolled for this course" });

    const numOfLessonInChapter: number = await querychapterLessonNumber(
      chapterId
    );
    const lessonData = await queryByLessonId(courseId, chapterId, lessonId);
    nextLessonNumber = lessonData.lesson_number + 1;
    nextchapterNumber = lessonData.chapter_number;

    // first check i fuser has done lesson before
    if (
      enrolled.current_chapter_number > nextchapterNumber ||
      (enrolled.current_chapter_number === nextchapterNumber &&
        enrolled.current_lesson_number > nextLessonNumber)
    ) {
      // no need to carry out any update has user have alredy done course before
      // check if the lesson is the last lesson in the chapter if true send first lesson in next chapter
      if (nextLessonNumber > numOfLessonInChapter) {
        nextLessonNumber = 1;
        nextchapterNumber = lessonData.chapter_number + 1;
      }

      //console.log(courseId, nextchapterNumber, nextLessonNumber, 'in quiz submit')
      const lesson = await queryLessonByChapterAndNUmber(
        courseId,
        nextchapterNumber,
        nextLessonNumber
      );

      res.json({
        courseId: courseId,
        chapterId: lesson.chapter_id,
        chapterNumber: nextchapterNumber,
        lessonNumber: nextLessonNumber,
      });
      return;
    }

    if (nextLessonNumber > numOfLessonInChapter) {
      nextLessonNumber = 1;
      nextchapterNumber = lessonData.chapter_number + 1;
      const numOfChapterInCourse: number = await queryCourseChapterNumber(
        courseId
      );

      if (nextchapterNumber > numOfChapterInCourse) {
        // user has completed course
        // update user enrolled......
        const updated = await queryCourseCompletion(userId, courseId);
        if (!updated) throw "error updating user completion";

        const courseData = await queryCourse(courseId);
        const userData = await queryUserProfile(userId);

        // make query to get  currentChapterId, nextLessonId
        const lesson = await queryLessonByChapterAndNUmber(
          courseId,
          nextchapterNumber - 1,
          numOfLessonInChapter
        );

        // update user enrollment data
        const updated2: boolean =
          await updateUserEnrolledCurrentLessonAndChapter(
            userId,
            courseId,
            lesson.chapter_id,
            lesson.lesson_id,
            nextchapterNumber - 1,
            numOfLessonInChapter,
            computeQuizScore(
              lessonData.lesson_number,
              lessonData.chapter_number,
              percentage,
              enrolled.quiz_performance
            )
          );

        if (!updated2) throw "error updating user course progress";

        return res.json({
          status: "completed",
          courseName: courseData.course_name,
          userName: userData.first_name,
        });
      }
    }

    // make query to get  currentChapterId, nextLessonId
    const lesson = await queryLessonByChapterAndNUmber(
      courseId,
      nextchapterNumber,
      nextLessonNumber
    );

    // update user enrollment data
    const update: boolean = await updateUserEnrolledCurrentLessonAndChapter(
      userId,
      courseId,
      lesson.chapter_id,
      lesson.lesson_id,
      nextchapterNumber,
      nextLessonNumber,
      ((noQuiz ? enrolled.quiz_performance : percentage) +
        enrolled.quiz_performance) /
        2
    );

    //@ts-ignore
    if (update) {
      res.json({
        courseId: courseId,
        chapterId: lesson.chapter_id,
        chapterNumber: nextchapterNumber,
        lessonNumber: nextLessonNumber,
      });
      return;
    }

    throw "somthig went wromg";
  } catch (err) {
    console.error("error in get submit quiz...........", err);
    res.status(500).json({ message: err });
  }
};

// helper function to compute quiz score
const computeQuizScore = (
  lessonNumber: number,
  chapterNumber: number,
  percentage: number,
  prevPerformance: number
): number => {
  if (lessonNumber === 1 && chapterNumber === 1) return percentage;

  return (percentage + prevPerformance) / 2;
};

// handler toge course price
const getCoursePrice = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);

    const courseData = await queryCourse(courseId);
    res.json({
      price: courseData.price,
      discount: courseData.full_price_discount,
    });
  } catch (err) {
    console.error("error in get submit quiz...........", err);
    res.status(500).json({ message: err });
  }
};

export { getLecture, getQuiz, handleQuizSubmission, getCoursePrice };
