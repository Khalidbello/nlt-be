import { Request, Response } from "express";
import { queryAdminCreateQuiz } from "../../services/admin/quiz-queries";
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
    }
}

export {
    createQuiz,
    adminGetQuiz,
}