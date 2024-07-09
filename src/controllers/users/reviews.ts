import { query, Request, Response } from "express"
import { queryGetReviews, querySaveReview, queryUpdateUserReviewed } from "../../services/users/reviews-queries";
import { queryUserDp, queryUserProfile } from "../../services/users/user-query-3";
import { CustomSessionData } from "../../types/session-types";

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
        console.error('error getting user dp for review', err);
        res.status(500).json({ message: err });
    };
};


// function to handle review submision
const reviewSubmitted = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const { courseName, courseId, review } = req.body;
        console.log('debugginggggggggg', courseName, courseId, review);
        if (!courseName || !review || !courseId) return res.status(400).json({ message: 'Incomplete data sent to server for processing.' });

        const profieData = await queryUserProfile(userId);

        const saved = await querySaveReview(userId, courseName, review, profieData.first_name);

        if (!saved) throw 'Something went wrong';

        await queryUpdateUserReviewed(courseId, userId);
        res.json({ message: 'Review submitted successfuly' });
    } catch (err) {
        console.error('error review submission', err);
        res.status(500).json({ message: err });
    };
};


export {
    getReviews,
    getUserDpforReview,
    reviewSubmitted,
}