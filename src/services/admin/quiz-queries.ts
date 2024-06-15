import pool from "../../modules/connnect-db";

// function to create new quiz 
const queryAdminCreateQuiz = (
    courseId: number, chapterId: number, lessonId: number, question: string, option1: string, option2: string, option3: string, option4: string, answer: string
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO questions (course_id, chapter_id, lesson_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [courseId, chapterId, lessonId, question, option1, option2, option3, option4, answer], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// query to edit question
const queryAdminEditQustion = (questionId: number, question: string, option1: string, option2: string, option3: string, option4: string, answer: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE questions SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ? WHERE question_id = ?';

        pool.query(query, [question, option1, option2, option3, option4, answer, questionId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// query to delete question
const queryAdminDeleteQuestion = (questionId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM questions WHERE question_id = ?';

        pool.query(query, [questionId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        })
    });
};


export {
    queryAdminCreateQuiz,
    queryAdminEditQustion,
    queryAdminDeleteQuestion,
}