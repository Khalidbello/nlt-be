import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryAdminByEmail } from "../../services/admin/auth";

const adminLoginHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const response = await queryAdminByEmail(email.trim());
        if (response.length > 0 && response[0].password === password.trim()) {
            console.log('Admin found', email, password);

            (req.session as CustomSessionData).user = {
                email: email,
                type: 'admin',
                id: response[0].id
            }
            return res.status(200).json({ message: 'logged in succesfully' });

        } else {
            console.log('Admin not found email not co', email, password);
        }
        res.status(404).json({ message: 'admin with cridentials not found' });
    } catch (err) {
        console.error('error signing in admin', err);
        res.status(500).json({ message: err });
    };
};

export {
    adminLoginHandler,
};       