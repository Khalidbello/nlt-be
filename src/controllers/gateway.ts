import { Request, Response } from "express";
import { CustomSessionData } from "../types/session-types";
import { queryUserProfile } from "../services/user-query-3";
import { queryCourse } from "../services/user-queries";
import generateRandomAlphanumericCode from "../modules/generate-random-string";
import { handleFreeEnroll } from "./enrollments";
import enrollUser from "../modules/course-enroller";
const Flutterwave = require('flutterwave-node-v3');

const generateOneTimeAcc = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        const courseId = parseInt(req.params.courseId)
        const paymentType = req.params.paymentType;
        let price: number; // amount expected to be recieved into account;


        if (!userId || paymentType !== 'full' && paymentType !== 'half' && paymentType !== 'completeHalf' || !courseId) return res.status(401).json({ message: 'incorrect data cannot be processed' });

        const userInfo = await queryUserProfile(userId);
        const courseData = await queryCourse(courseId);

        if (paymentType === 'full') {
            price = courseData.price - (courseData.price * 5 / 100);
        } else {
            price = Math.floor(courseData.price / 2)
        }

        const details = {
            tx_ref: generateRandomAlphanumericCode(10),
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

        const response = await flw.Charge.bank_transfer(details); console.log('accoint detauls :', response)

        if (response.status === 'success') {
            res.json({
                courseName: courseData.course_name,
                accountName: 'NLt FLw',
                accountNumber: response.meta.authorization.transfer_account,
                bankName: response.meta.authorization.transfer_bank,
                amount: response.meta.authorization.transfer_amount,
            })
        } else {
            throw 'error in creating virtual acount'
        }
    } catch (err) {
        console.log('error in generate one time account number', err);
        res.status(500).json({ message: err });
    }
}


// function to responsd ti webhok event
const webhookHandler = async (req: Request, res: Response) => {
    try {
        console.log('am in webhook');
        const signature = req.headers['verif-hash'];
        let payload;
        let meta;

        if (!signature || signature != process.env.FLW_H) {
            // This request isn't from Flutterwave; discard
            console.log('webhook rejectd not from a trusted source');
            return res.status(401).end();
        };

        payload = req.body;
        console.log('webhook payload', payload);

        if (payload.status !== "successful") return console.log('payment failed..... in webhook handler.......');

        const id = payload.id;
        const reference = Number(payload.txRef);
        const amount = Number(payload.amount);

        // reverify payment
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);

        const response = await flw.Transaction.verify({ id: id });
        console.log('transaction details', response);

        if (response.status !== 'success') return console.log('error occured while confirming tansacion');

        if (response.data.status !== "successful") return console.log("transaction not successfully carried out: in wallet top up");

        enrollUser(response.data);
    } catch (err) {
        console.log('error in webhook', err);
    };
};


export {
    generateOneTimeAcc,
    webhookHandler
}