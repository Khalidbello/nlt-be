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

export {
    queryAdminCreateQuiz
}