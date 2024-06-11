import pool from "../../modules/connnect-db";

const queryCreateNewCourse = (imageBuffer: any, courseName: string, title: string, aboutCourse: string, price: number, discount: number) => {
    return new Promise<any>((resolve, reject) => {
        const query = 'INSERT INTO courses (image, course_name, course_title, course_description, price, full_price_discount, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const date = new Date();

        pool.query(query, [imageBuffer, courseName, title, aboutCourse, price, discount, date], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        })
    })
};

// query to update course data 
const queryUpdateCourse = (courseId: number, imageBuffer: Buffer, courseName: string, title: string, aboutCourse: string, price: number, discount: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE courses SET image = ?, course_name = ?, course_title = ?, course_description = ?, price = ?, full_price_discount = ? WHERE course_id = ? ';

        pool.query(query, [imageBuffer, courseName, title, aboutCourse, price, discount, courseId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0)
        })
    })
};


// query to create a new chapter
const queryCreteChapter = (courseId: number, chaptertitle: string, chapterNum: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO chapters (course_id, chapter_title, chapter_number) VALUES (?, ?, ?)';

        pool.query(query, [courseId, chaptertitle, chapterNum], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        })
    })
}

// query t check if chapter exists
const queryChapterExist = (courseId: number, chapterNum: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'SELECT chapter_id FROM chapters WHERE course_id = ? AND chapter_number =  ?';

        pool.query(query, [courseId, chapterNum], (err, result) => {
            if (err) return reject(err);

            resolve(result.length > 0);
        })
    })
};


interface queryChapterType {
    chapter_id: number;
    course_id: number;
    chapter_title: string;
    chapter_number: number
};

// query to get course data
const queryChapter = (courseId: number, chapterId: number): Promise<queryChapterType> => {
    return new Promise<queryChapterType>((resolve, reject) => {
        const query = 'SELECT chapter_id, course_id, chapter_title, chapter_number FROM chapters WHERE course_id = ? AND chapter_id = ?';

        pool.query(query, [courseId, chapterId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// query to update chapter
const queryUpdateChapter = (courseId: number, chapterId: number, chapterNumber: number, chapterTitle: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE chapters SET chapter_title = ?, chapter_number = ? WHERE course_id = ? AND chapter_id = ?';

        pool.query(query, [chapterTitle, chapterNumber, courseId, chapterId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryCreateNewCourse,
    queryUpdateCourse,
    queryCreteChapter,
    queryChapterExist,
    queryChapter,
    queryUpdateChapter,
}