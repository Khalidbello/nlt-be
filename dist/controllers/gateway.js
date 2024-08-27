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
exports.webhookHandler = exports.generateOneTimeAcc = void 0;
const user_query_3_1 = require("../services/users/user-query-3");
const user_queries_1 = require("../services/users/user-queries");
const generate_random_string_1 = __importDefault(require("../modules/generate-random-string"));
const course_enroller_1 = __importDefault(require("../modules/course-enroller"));
const notificaion_queries_1 = require("../services/users/notificaion-queries");
const Flutterwave = require('flutterwave-node-v3');
const generateOneTimeAcc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        const courseId = parseInt(req.params.courseId);
        const paymentType = req.params.paymentType;
        let price; // amount expected to be recieved into account;
        if (!userId || paymentType !== 'full' && paymentType !== 'half' && paymentType !== 'completeHalf' || !courseId)
            return res.status(401).json({ message: 'incorrect data cannot be processed' });
        const userInfo = yield (0, user_query_3_1.queryUserProfile)(userId);
        const courseData = yield (0, user_queries_1.queryCourse)(courseId);
        if (paymentType === 'full') {
            price = courseData.price - (courseData.price * 5 / 100);
        }
        else {
            price = Math.floor(courseData.price / 2);
        }
        const details = {
            tx_ref: (0, generate_random_string_1.default)(10, false),
            amount: price,
            email: userInfo.email,
            fullname: userInfo.first_name + ' ' + userInfo.last_name,
            currency: 'NGN',
            meta: {
                courseId: courseId,
                userId: userId,
                paymentType: paymentType
            }
        };
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);
        const response = yield flw.Charge.bank_transfer(details);
        console.log('accoint detauls :', response);
        if (response.status === 'success') {
            res.json({
                courseName: courseData.course_name,
                accountName: 'NLt FLw',
                accountNumber: response.meta.authorization.transfer_account,
                bankName: response.meta.authorization.transfer_bank,
                amount: response.meta.authorization.transfer_amount,
            });
        }
        else {
            throw 'error in creating virtual acount';
        }
    }
    catch (err) {
        console.error('error in generate one time account number', err);
        res.status(500).json({ message: err });
    }
});
exports.generateOneTimeAcc = generateOneTimeAcc;
// function to responsd ti webhok event
const webhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.headers['verif-hash'];
        let payload;
        let meta;
        if (!signature || signature != process.env.FLW_H) {
            // This request isn't from Flutterwave; discard
            return res.status(401).end();
        }
        ;
        payload = req.body;
        if (payload.status !== "successful")
            return console.log('payment failed..... in webhook handler.......');
        const id = payload.id;
        const reference = Number(payload.txRef);
        const amount = Number(payload.amount);
        // reverify payment
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);
        const response = yield flw.Transaction.verify({ id: id });
        //console.log('transaction details', response);
        if (response.status !== 'success')
            return console.log('error occured while confirming tansacion');
        if (response.data.status !== "successful")
            return console.log("transaction not successfully carried out: in wallet top up");
        (0, notificaion_queries_1.queryAddNewNotification)(response.data.meta.userId, `Your payment of ₦ ${response.amount} have been succesfully recieved`, "success");
        (0, course_enroller_1.default)(response.data);
    }
    catch (err) {
        console.error('error in webhook', err);
    }
    ;
});
exports.webhookHandler = webhookHandler;
//# sourceMappingURL=gateway.js.map