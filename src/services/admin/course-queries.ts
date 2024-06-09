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

export {
    queryCreateNewCourse,
}