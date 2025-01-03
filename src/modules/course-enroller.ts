import { queryAddNewNotification } from "../services/users/notificaion-queries";
import {
  queryCourse,
  queryEnrolled,
  queryLessonByChapterAndNUmber,
  queryNewEnrollment,
} from "../services/users/user-queries";
import {
  queryUserProfile,
  updateEnrollmentPaymentType,
} from "../services/users/user-query-3";
import courseEnrollEmailSender from "./emailers/course-enroll";

const enrollUser = async (data: any) => {
  try {
    const userId = data.meta.userId;
    const courseId = data.meta.courseId;
    const userEmail = data.customer.email;
    const paymentType = data.meta.paymentType;
    const courseData = await queryCourse(courseId);
    const userData = await queryUserProfile(userId);
    let expecedPrice;
    let payment: "full" | "half" = paymentType === "half" ? "half" : "full"; // variable to gold course enrollment type half or full

    if (paymentType === "half" || paymentType === "completeHalf") {
      expecedPrice = Math.floor(courseData.price / 2);
    } else {
      expecedPrice = Math.floor(
        courseData.price -
          (courseData.price * courseData.full_price_discount) / 100
      );
    }

    if (data.currency !== "NGN" && data.amount < expecedPrice) {
      await queryAddNewNotification(
        data.meta.userId,
        `an error occured processing your payment of ₦ ${data.amount}. for the enrollment of ${courseData.course_name} Please report an issue for rapid resolving.`,
        "error"
      );
      throw "requirement not met"; // send user email and tell them to contct admin
    }
    const userEnrolled = await queryEnrolled(userId, courseId);

    if (userEnrolled?.payment_type) {
      // update user query
      await updateEnrollmentPaymentType(userId, courseId, payment);
      courseEnrollEmailSender(
        userEmail,
        userData.first_name,
        paymentType,
        courseData.course_name
      );
      queryAddNewNotification(
        userId,
        `Your enrollment for ${courseData.course_name} has been updated. Enrollment type: ${paymentType}`,
        "info"
      );
    } else {
      // new enrollemt
      const firtLessonInfo = await queryLessonByChapterAndNUmber(
        courseId,
        1,
        1
      );

      await queryNewEnrollment(
        userId,
        courseId,
        payment,
        firtLessonInfo.chapter_id,
        firtLessonInfo.chapter_id
      );
      courseEnrollEmailSender(
        userEmail,
        userData.first_name,
        paymentType,
        courseData.course_name
      );
      queryAddNewNotification(
        userId,
        `You have successfully enrolled for ${courseData.course_name}. Enrollment type: ${paymentType}`,
        "success"
      );
    }
  } catch (err) {
    console.error("error in course enroller", err);
  }
};

export default enrollUser;
