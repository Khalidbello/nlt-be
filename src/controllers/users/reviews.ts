import { Request, Response } from "express"
import { queryGetReviews } from "../../services/users/reviews";
import { queryUserDp } from "../../services/users/user-query-3";

const getReviews = async (req: Request, res: Response) => {
    try {
        const { pagin, limit } = req.params;
        const reviews = await queryGetReviews(parseInt(pagin), parseInt(limit));

        res.json(reviews);
    } catch (err) {
        console.error('error in get reiews courses', err)
        res.status(500).json({ message: err });
    };
};



// route to retunr user profile pucture for review
const getUserDpforReview = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const userDp = await queryUserDp(userId);

        if (!userDp) return res.status(404).json({ message: 'not dp found' });

        userDp.dp = Buffer.from(userDp.dp).toString('base64');

        res.json(userDp);
    } catch (err) {
        console.log('error user image upload', err);
        res.status(500).json({ message: err });
    };
};
export {
    getReviews,
    getUserDpforReview,
}