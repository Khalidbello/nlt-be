"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSubmitted = exports.getUserDpforReview = exports.getReviews = void 0;
const reviews_queries_1 = require("../../services/users/reviews-queries");
const user_query_3_1 = require("../../services/users/user-query-3");
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pagin, limit } = req.params;
        const reviews = yield (0, reviews_queries_1.queryGetReviews)(parseInt(pagin), parseInt(limit));
        res.json(reviews);
    }
    catch (err) {
        console.error('error in get reiews courses', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getReviews = getReviews;
// route to retunr user profile pucture for review
const getUserDpforReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const userDp = yield (0, user_query_3_1.queryUserDp)(userId);
        if (!userDp)
            return res.status(404).json({ message: 'not dp found' });
        userDp.dp = Buffer.from(userDp.dp).toString('base64');
        res.json(userDp);
    }
    catch (err) {
        console.error('error getting user dp for review', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getUserDpforReview = getUserDpforReview;
// function to handle review submision
const reviewSubmitted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        const { courseName, courseId, review } = req.body;
        console.log('data for review', courseName, courseId, review);
        if (!courseName || !review || !courseId)
            return res.status(400).json({ message: 'Incomplete data sent to server for processing.' });
        const profieData = yield (0, user_query_3_1.queryUserProfile)(userId);
        const saved = yield (0, reviews_queries_1.querySaveReview)(userId, courseName, review, profieData.first_name);
        if (!saved)
            throw 'Something went wrong';
        yield (0, reviews_queries_1.queryUpdateUserReviewed)(courseId, userId);
        res.json({ message: 'Review submitted successfuly' });
    }
    catch (err) {
        console.error('error review submission', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.reviewSubmitted = reviewSubmitted;
//# sourceMappingURL=reviews.js.map