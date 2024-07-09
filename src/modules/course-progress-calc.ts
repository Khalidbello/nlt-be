import { chaptersType, enrolledType, getChapters, queryEnrolled, querychapterLessonNumber } from "../services/users/user-queries";

interface calcProgressType {
    numOfChapter: number;
    numOfLessons: number;
    quiz: number;
    percentageCompletion: number;
    enrolled: boolean;
    currentLesson: number;
    currentChapter: number;
    currentChapterId: number;
    lastVisited: string;
    chapters: chaptersType[];
    lessonNumbers: { [key: number]: number };
    completed: boolean;
    reviewed: boolean;
}

// this function calculates the course progress and also returns somw vital data
const calcProgress = async (userId: number, courseId: number): Promise<calcProgressType> => {
    return new Promise<calcProgressType>(async (resolve, reject) => {
        try {
            console.log('in calc progress userID, courseId', userId, courseId)

            const lessonNumbers: { [key: number]: number } = {}; // key is chapter number valueis number of lessons
            let totalLessonNumber: number = 0;
            let completedLessonNumber: number = 0;
            let percentageCompletion: number;
            let enrolledData: enrolledType; // variablr to hold course enrolled data
            let enrolled: boolean = false;

            enrolledData = await queryEnrolled(userId, courseId);

            // get all chapters ordered by chapter number
            const chapters: chaptersType[] = await getChapters(courseId); // ordered in accordanc with chapter number

            for (let index = 0; index < chapters.length; index++) {
                const lessonNumber: number = await querychapterLessonNumber(chapters[index].chapter_id);

                lessonNumbers[chapters[index].chapter_number] = lessonNumber;
                totalLessonNumber += lessonNumber;
            };

            // get lesson completed
            if (enrolledData?.payment_type) {
                enrolled = true
                for (let i = 1; i < enrolledData.current_chapter_number + 1; i++) {
                    console.log('in last loop', i);
                    if (i === enrolledData.current_chapter_number) {
                        chapters[i - 1].completed = 'ongoing';
                        completedLessonNumber += enrolledData.current_lesson_number - 1;
                    } else {
                        chapters[i - 1].completed = 'finished';
                        completedLessonNumber += lessonNumbers[i];
                    };
                };
            };

            // calculate percentage
            percentageCompletion = (completedLessonNumber / totalLessonNumber) * 100;

            resolve({
                numOfChapter: chapters.length,
                numOfLessons: totalLessonNumber,
                quiz: enrolledData?.quiz_performance,
                percentageCompletion,
                enrolled,
                currentLesson: enrolledData?.current_lesson_number,
                currentChapter: enrolledData?.current_chapter_number,
                currentChapterId: enrolledData?.current_chapter_id,
                lastVisited: enrolledData?.last_visited,
                chapters: chapters,
                lessonNumbers: lessonNumbers,
                completed: enrolledData?.completed,
                reviewed: enrolledData?.reviewed
            })
        }
        catch (error) {
            reject(error);
        }
    })
}

export default calcProgress;
export type { calcProgressType }