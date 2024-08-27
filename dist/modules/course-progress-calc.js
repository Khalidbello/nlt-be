"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_queries_1 = require("../services/users/user-queries");
// this function calculates the course progress and also returns somw vital data
const calcProgress = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const lessonNumbers = {}; // key is chapter number valueis number of lessons
            let totalLessonNumber = 0;
            let completedLessonNumber = 0;
            let percentageCompletion;
            let enrolledData; // variablr to hold course enrolled data
            let enrolled = false;
            enrolledData = yield (0, user_queries_1.queryEnrolled)(userId, courseId);
            // get all chapters ordered by chapter number
            const chapters = yield (0, user_queries_1.getChapters)(courseId); // ordered in accordanc with chapter number
            for (let index = 0; index < chapters.length; index++) {
                const lessonNumber = yield (0, user_queries_1.querychapterLessonNumber)(chapters[index].chapter_id);
                lessonNumbers[chapters[index].chapter_number] = lessonNumber;
                totalLessonNumber += lessonNumber;
            }
            ;
            // get lesson completed
            if (enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.payment_type) {
                enrolled = true;
                for (let i = 1; i < enrolledData.current_chapter_number + 1; i++) {
                    if (i === enrolledData.current_chapter_number) {
                        chapters[i - 1].completed = 'ongoing';
                        completedLessonNumber += enrolledData.current_lesson_number - 1;
                    }
                    else {
                        chapters[i - 1].completed = 'finished';
                        completedLessonNumber += lessonNumbers[i];
                    }
                    ;
                }
                ;
            }
            ;
            // calculate percentage
            percentageCompletion = (completedLessonNumber / totalLessonNumber) * 100;
            resolve({
                numOfChapter: chapters.length,
                numOfLessons: totalLessonNumber,
                quiz: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.quiz_performance,
                percentageCompletion,
                enrolled,
                currentLesson: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.current_lesson_number,
                currentChapter: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.current_chapter_number,
                currentChapterId: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.current_chapter_id,
                lastVisited: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.last_visited,
                chapters: chapters,
                lessonNumbers: lessonNumbers,
                completed: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.completed,
                reviewed: enrolledData === null || enrolledData === void 0 ? void 0 : enrolledData.reviewed
            });
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.default = calcProgress;
//# sourceMappingURL=course-progress-calc.js.map