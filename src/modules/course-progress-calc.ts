import { chaptersType, enrolledType, getChapters, queryEnrolled, querychapterLessonNumber } from "../services/user-queries";

interface calcProgressType {
    numOfChapter: number;
    numOfLessons: number;
    percentageCompletion: number;
    enrolled: boolean;
    currentLesson: number;
    currentChapter: number;
    lastVisited: string;
}

const calcProgress = async (userId: number, courseId: number): Promise<calcProgressType> => {
    return new Promise<calcProgressType>(async (resolve, reject) => {
        try {
            const lessonNumbers: { [key: number]: number } = {};
            let totalLessonNumber: number = 0;
            let completedLessonNumber: number = 0;
            let percentageCompletion: number;
            let enrolledData: enrolledType; // variablr to hold course enrolled data
            let enrolled: boolean = false;
            console.log(userId, courseId, 'in cacl prress');
            enrolledData = await queryEnrolled(userId, courseId);

            console.log('enrolled response', enrolledData)
            // get all chapters ordered by chapter number
            const chapters: chaptersType[] = await getChapters(courseId); // ordered in accordanc with chapter number
            console.log(chapters, 'chapters.......')

            for (let index = 0; index < chapters.length; index++) {
                console.log('chapter detals', chapters[index]);
                const lessonNumber: number = await querychapterLessonNumber(chapters[index].chapter_id);
                lessonNumbers[chapters[index].chapter_number] = lessonNumber;
                totalLessonNumber += lessonNumber;
            };
            console.log('lesson numbers..............', lessonNumbers);

            // get lesson completed
            if (enrolledData?.current_lesson_number) {
                enrolled = true
                for (let i = 1; i < enrolledData.current_chapter_number + 1; i++) {
                    console.log('in last loop', i);
                    if (i === enrolledData.current_chapter_number) {
                        console.log(lessonNumbers[i], enrolledData.current_lesson_number, 'ahv d/.............');
                        completedLessonNumber += enrolledData.current_lesson_number - 1;
                    } else {
                        completedLessonNumber += lessonNumbers[i];
                    };
                };
            };

            // calculate percentage
            percentageCompletion = (completedLessonNumber / totalLessonNumber) * 100;

            resolve({
                numOfChapter: chapters.length,
                numOfLessons: totalLessonNumber,
                percentageCompletion,
                enrolled,
                currentLesson: enrolledData?.current_lesson_number,
                currentChapter: enrolledData?.current_chapter_number,
                lastVisited: enrolledData?.last_visited
            })
        }
        catch (error) {
            reject(error);
        }
    })
}

export default calcProgress;
export type { calcProgressType }