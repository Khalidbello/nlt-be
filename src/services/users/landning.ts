import pool from "../../modules/connnect-db";

// query to set user course completion
const queryCourseImages = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT image FROM courses WHERE status != ? ORDER BY created_at DESC LIMIT ?";

    pool.query(query, ["deactivated", 4], (err, result: any) => {
      if (err) return reject(err);

      resolve(result);
    });
  });
};

export { queryCourseImages };
