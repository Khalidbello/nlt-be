import pool from "../modules/connnect-db";

interface queryUserProfileType {

}

const queryUserProfile = () => {
    return new Promise((resolve, reject) => {
        const query = '';

        pool.query(query, [], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}

export { queryUserProfile }

export type { queryUserProfileType }