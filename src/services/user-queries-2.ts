import pool from "../modules/connnect-db"

//get course number of lesons
const queryCourseLessonNumber = (courseId: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM lessons WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}


// get course numbe rof chapters
const queryCourseChapterNumber = (courseId: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM chapters WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}

// get number of enrolled students
const queryCourseEnrolledStudent = (courseId: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM enrolled WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}


export {
    queryCourseLessonNumber,
    queryCourseChapterNumber,
    queryCourseEnrolledStudent,
}