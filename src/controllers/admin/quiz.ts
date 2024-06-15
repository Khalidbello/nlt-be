import { Request, Response } from "express";
import { queryAdminCreateQuiz, queryAdminDeleteQuestion, queryAdminEditQustion } from "../../services/admin/quiz-queries";
import { queryQuiz } from "../../services/users/user-queries-2";


// handler to create quiz
const createQuiz = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        const { question, option1, option2, option3, option4, answer } = req.body;

        if (!courseId || !chapterId || !lessonId || !question || !option1 || !option2 || !option3 || !option4 || !answer) {
            return res.status(400).json({ message: 'Incomplete data sent to server for processing' });
        };

        const created = await queryAdminCreateQuiz(courseId, chapterId, lessonId, question, option1, option2, option3, option4, answer);

        if (!created) throw 'something went wrong creating quiz';

        res.json({ message: 'quiz created succesfully.' });
    } catch (err) {
        console.log('error creating quiz', err);
        res.status(500).json({ mesage: err });
    };
};


// handler to fetch quiz
const adminGetQuiz = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);

        if (!courseId || !chapterId || !lessonId) return res.status(400).json({ message: 'Incomplete data sent to server for processing' });

        const quiz = await queryQuiz(courseId, chapterId, lessonId);

        res.json(quiz);
    } catch (err) {
        console.log('error fetching quiz', err);
        res.status(500).json({ mesage: err });
    };
};


// function to edit quiz
const adminEditQuiz = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const chapterId = parseInt(req.params.chapterId);
        const lessonId = parseInt(req.params.lessonId);
        const questionId = parseInt(req.params.questionId);
        const { question, option1, option2, option3, option4, answer } = req.body;

        if (!courseId || !chapterId || !lessonId || !questionId || !question || !option1 || !option2 || !option3 || !option4 || !answer) {
            return res.status(400).json({ message: 'Incomplete data sent to server for processing' });
        };

        const edited = await queryAdminEditQustion(questionId, question, option1, option2, option3, option4, answer);

        if (!edited) throw 'somethign went wrong trying to update question';

        res.json({ message: 'question edited sucessfully.' });
    } catch (err) {
        console.log('error editing questions', err);
        res.status(500).json({ mesage: err });
    };
};


// function to delete question
const adminDeleteQuestion = async (req: Request, res: Response) => {
    try {
        const questionId = parseInt(req.params.questionId);

        const deleted = await queryAdminDeleteQuestion(questionId);

        if (!deleted) throw 'error deleting question';

        res.json({ message: 'deleted successfully' });
    } catch (err) {
        console.log('error deleting question', err);
        res.status(500).json({ mesage: err });
    };
};



export {
    createQuiz,
    adminGetQuiz,
    adminEditQuiz,
    adminDeleteQuestion,
}