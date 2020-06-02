import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import generateToken from '../utils/generateToken';

const db = new PrismaClient();
export default  {

    async index(req: Request, res: Response) {
        // List all users
        const users = await db.users.findMany({
            select: {
                id: true,
                email: true,
                name: true
            }
        });
        return res.status(202).json({ users });
    },

    async create(req: Request, res: Response) {
        const { email, name } = req.body;
        let { password } = req.body; // let to be undefined later
        // Verify is all entered and if there is none with the entered email inside database
        if (!email || !password || !name || await db.users.findOne({
            where: {
                email
            }
        })) return res.status(400).json({ error: 'error' });

        // Crypt the password
        let hashPassword: string | undefined  = await bcrypt.hash(password, 10);

        // extract id to make the token
        const { id } = await db.users.create({
            data: {
                email,
                name,
                password: hashPassword
            },
            select: {
                id: true
            }
        });
        
        // Make password undefined
        password = undefined;
        hashPassword = undefined;

        // Return the token
        return res.status(201).json({ token: generateToken({ id }) })
    },

    async update(req: Request, res: Response) {
        const { name } = req.body;
        const user = await db.users.update({
            where: { id: req.id },
            data: {
                name 
            },
            select: {
                id: true,
                name: true
            }
        });
        return res.status(200).json({ 
            name: user.name,
            id: user.id
         })
    },
}