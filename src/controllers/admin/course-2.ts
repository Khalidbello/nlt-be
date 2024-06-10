import { Request, Response, query } from "express";
import { queryChapterExist, queryCreteChapter } from "../../services/admin/course-queries";

const createChapter = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const { chapterTitle, chapterNum } = req.body;

        if (!chapterTitle || !chapterNum) return res.status(400).json({ message: 'incompete data sent to server for processing' });

        const chapterExist = await queryChapterExist(courseId, parseInt(chapterNum));

        if (chapterExist) return res.status(401).json({ message: 'chapter  already exist' });

        const chapterCreated = await queryCreteChapter(courseId, chapterTitle, chapterNum);;

        if (!chapterCreated) throw 'something went wrong creating new chapter';

        res.json({ message: 'Chapter creatred sucesfully' });
    } catch (err) {
        console.log('error in creating chapter chapter', err);
        res.status(500).json({ message: err });
    };
};


export {
    createChapter,
}