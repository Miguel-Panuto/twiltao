import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default  {

    async index(req: Request, res: Response) {
        const posts = await db.posts.findMany();
        return res.status(200).json(posts)
    },

    async create(req: Request, res: Response) {
        const { content } = req.body;
        const post = await db.posts.create({
            data: {
                content,
                users: {
                    connect: {
                        id: req.id
                    }
                }
            }
        });
        return res.status(201).json(post);
    },

    async update(req: Request, res: Response) {
        const { content, id } = req.body;
        // Find a valid post
        const isValidPost = await db.posts.findMany({
            where: {
                id,
                user_id: req.id
            },
        });
        // If there is none valid, returns error
        if(isValidPost.length <= 0) return res.status(400).json({ error: 'Error' });
        // And then update inside the database
        const post = await db.posts.update({
            where: {
                id,
            },
            data: {
                content
            }
        });
        return res.status(201).json(post);
    },

    async delete(req: Request, res: Response) {
        const { id } = req.body;
        // Find if there is a valid post with that user
        const isValidPost = await db.posts.findMany({
            where: {
                id,
                user_id: req.id
            },
        });
        // If there is none returns error
        if(isValidPost.length <= 0) return res.status(400).json({ error: 'Error' });
        const post = await db.posts.delete({
            where: {
                id
            }
        });
        return res.status(201).json(post);
    }
}