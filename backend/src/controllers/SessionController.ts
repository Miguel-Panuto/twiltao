import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';

const db = new PrismaClient();

export default class SessionController {
    async create(req: Request, res: Response) {
        const { email } = req.body;
        let { password } = req.body;
        
        // Verify if there is none email or password entered
        if (!email || !password) return res.status(401).json({ error: 'error' });

        // Find inside database the user email
        let user = await db.users.findOne({
            where: {
                email
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });

        // if there is none user return error
        if(!user) return res.status(401).json({ error: 'error' });

        // Verify if the password does not match and return a error if not
        if(! await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'error' });

        const id = user.id; // Save the user id
        password = undefined; // Turn to undefined
        user = null; // Make null the user
        // And return the token
        return res.status(201).json({ token: generateToken({ id }) });
    }
}