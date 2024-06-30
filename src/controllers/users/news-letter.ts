import { Response, Request } from "express";
import { queryAddEmailToNewsLetter } from "../../services/users/news-letter-query";


const NewsLetter = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email;

        res.json({ message: 'news letter subcription successful.' });
        queryAddEmailToNewsLetter(email);
    } catch (err) {
        console.error('error in adding email to news letter', err);
    };
};


export {
    NewsLetter
}