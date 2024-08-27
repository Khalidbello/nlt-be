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
exports.handleFreeEnroll = void 0;
const user_queries_1 = require("../../services/users/user-queries");
const notificaion_queries_1 = require("../../services/users/notificaion-queries");
const handleFreeEnroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        const courseId = parseInt(req.params.courseId);
        if (!userId || !courseId)
            return res.status(401).json({ message: 'incomplete data sent to server' });
        const courseInfo = yield (0, user_queries_1.queryCourse)(courseId);
        const isEnrolled = yield (0, user_queries_1.queryEnrolled)(userId, courseId);
        // @ts-ignore
        if (isEnrolled)
            return res.json({ message: 'user alredy enrolled free' });
        // get course current lesson id and chapter id
        const courseData = yield (0, user_queries_1.queryLessonByChapterAndNUmber)(courseId, 1, 1);
        const result = yield (0, user_queries_1.queryNewEnrollment)(userId, courseId, 'free', courseData.chapter_id, courseData.lesson_id);
        const message = 'Free enrollment for ' + courseInfo.course_name.toUpperCase() + ' succesfull.';
        yield (0, notificaion_queries_1.queryAddNewNotification)(userId, message, 'info');
        if (result)
            return res.json({ mesage: 'enrolld free succesfully' });
        throw 'something went wrong';
    }
    catch (err) {
        console.error('error in enroll for free', err);
        res.status(500).json({ error: err });
    }
    ;
});
exports.handleFreeEnroll = handleFreeEnroll;
//# sourceMappingURL=enrollments.js.map