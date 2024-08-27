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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificaion_queries_1 = require("../services/users/notificaion-queries");
const user_queries_1 = require("../services/users/user-queries");
const user_query_3_1 = require("../services/users/user-query-3");
const course_enroll_1 = __importDefault(require("./emailers/course-enroll"));
const enrollUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = data.meta.userId;
        const courseId = data.meta.courseId;
        const userEmail = data.customer.email;
        const paymentType = data.meta.paymentType;
        const courseData = yield (0, user_queries_1.queryCourse)(courseId);
        const userData = yield (0, user_query_3_1.queryUserProfile)(userId);
        let expecedPrice;
        let payment = paymentType === 'half' ? 'half' : 'full'; // variable to gold course enrollment type half or full
        if (paymentType === 'half' || paymentType === 'completeHalf') {
            expecedPrice = Math.floor(courseData.price / 2);
        }
        else {
            expecedPrice = Math.floor(courseData.price - (courseData.price * courseData.full_price_discount / 100));
        }
        ;
        if (data.currency !== 'NGN' && data.amount < expecedPrice)
            throw 'requirement not met'; // send user email and tell them to contct admin
        const userEnrolled = yield (0, user_queries_1.queryEnrolled)(userId, courseId);
        if (userEnrolled === null || userEnrolled === void 0 ? void 0 : userEnrolled.payment_type) {
            // update user query
            yield (0, user_query_3_1.updateEnrollmentPaymentType)(userId, courseId, payment);
            (0, course_enroll_1.default)(userEmail, userData.first_name, paymentType, courseData.course_name);
            (0, notificaion_queries_1.queryAddNewNotification)(userId, `Your enrollment for ${courseData.course_name} has been updated. Enrollment type: ${paymentType}`, "info");
        }
        else {
            // new enrollemt 
            const firtLessonInfo = yield (0, user_queries_1.queryLessonByChapterAndNUmber)(courseId, 1, 1);
            yield (0, user_queries_1.queryNewEnrollment)(userId, courseId, payment, firtLessonInfo.chapter_id, firtLessonInfo.chapter_id);
            (0, course_enroll_1.default)(userEmail, userData.first_name, paymentType, courseData.course_name);
            (0, notificaion_queries_1.queryAddNewNotification)(userId, `You have successfully enrolled for ${courseData.course_name}. Enrollment type: ${paymentType}`, "success");
        }
        ;
    }
    catch (err) {
        console.error('error in course enroller', err);
    }
    ;
});
exports.default = enrollUser;
//# sourceMappingURL=course-enroller.js.map