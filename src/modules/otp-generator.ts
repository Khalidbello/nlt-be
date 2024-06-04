import { queryDeleteOtp, querySaveOtp } from "../services/otp-queries";
import generateRandomAlphanumericCode from "./generate-random-string";

const otpGenerator = async (userId: number): Promise<number> => {
    return new Promise<number>(async (resolve, reject) => {
        try {
            await queryDeleteOtp(userId);
            // @ts-ignore
            const otp: number = generateRandomAlphanumericCode(4, true);
            const saved: boolean = await querySaveOtp(userId, otp);

            if (!saved) throw 'failed to save new otp';

            resolve(otp)
        } catch (err) {
            reject(err);
        }
    })
};

export default otpGenerator;