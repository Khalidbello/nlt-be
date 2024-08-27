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
exports.adminDeleteQuestion = exports.adminEditQuiz = exports.adminGetQuiz = exports.createQuiz = void 0;
const quiz_queries_1 = require("../../services/admin/quiz-queries");
const user_queries_2_1 = require("../../services/users/user-queries-2");
// handler to create quiz
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        const { question, option1, option2, option3, option4, answer } = req.body;
        if (!courseId || !chapterId || !lessonId || !question || !option1 || !option2 || !option3 || !option4 || !answer) {
            return res.status(400).json({ message: 'Incomplete data sent to server for processing' });
        }
        ;
        const created = yield (0, quiz_queries_1.queryAdminCreateQuiz)(courseId, chapterId, lessonId, question, option1, option2, option3, option4, answer);
        if (!created)
            throw 'something went wrong creating quiz';
        res.json({ message: 'quiz created succesfully.' });
    }
    catch (err) {
        console.error('error creating quiz', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.createQuiz = createQuiz;
// handler to fetch quiz
const adminGetQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        if (!courseId || !chapterId || !lessonId)
            return res.status(400).json({ message: 'Incomplete data sent to server for processing' });
        const quiz = yield (0, user_queries_2_1.queryQuiz)(courseId, chapterId, lessonId);
        res.json(quiz);
    }
    catch (err) {
        console.error('error fetching quiz', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.adminGetQuiz = adminGetQuiz;
// function to edit quiz
const adminEditQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        const questionId = parseInt(req.params.questionId);
        const { question, option1, option2, option3, option4, answer } = req.body;
        if (!courseId || !chapterId || !lessonId || !questionId || !question || !option1 || !option2 || !option3 || !option4 || !answer) {
            return res.status(400).json({ message: 'Incomplete data sent to server for processing' });
        }
        ;
        const edited = yield (0, quiz_queries_1.queryAdminEditQustion)(questionId, question, option1, option2, option3, option4, answer);
        if (!edited)
            throw 'somethign went wrong trying to update question';
        res.json({ message: 'question edited sucessfully.' });
    }
    catch (err) {
        console.error('error editing questions', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.adminEditQuiz = adminEditQuiz;
// function to delete question
const adminDeleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = parseInt(req.params.questionId);
        const deleted = yield (0, quiz_queries_1.queryAdminDeleteQuestion)(questionId);
        if (!deleted)
            throw 'error deleting question';
        res.json({ message: 'deleted successfully' });
    }
    catch (err) {
        console.error('error deleting question', err);
        res.status(500).json({ mesage: err });
    }
    ;
});
exports.adminDeleteQuestion = adminDeleteQuestion;
//# sourceMappingURL=quiz.js.map