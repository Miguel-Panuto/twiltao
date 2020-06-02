import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyCallback } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

let authConfig = require('../config/auth.json');

const db = new PrismaClient();

const auth = async (req: Request, res: Response, next: NextFunction) => {
  // This will pickup the content from the authorization
  const authHeader = req.headers.authorization;

  // Verify if there is not a header, and this will send a error
  if (!authHeader)
    return res.status(401).json({ error: 'Not allowed, token expected' });

  // split in 2 the 'Bearer anthejwtcode'
  const parts: any = authHeader.split(' ');

  // Verify if is in 2 parts, if ins't will return a error
  if (parts.length !== 2) return res.status(401).json({ error: 'False token' });

  const [scheme, token] = parts;

  // Verify if isn't  bearer and return a error
  if ('bearer' !== scheme.toLowerCase()) {
    return res.status(401).json({ error: 'Token not in correct format' });
  }

  type user = {
    id: number;
  };

  const verifyLogin: VerifyCallback = async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'error' });
    const { id } = decoded as user;
    
    const user = await db.users.findOne({
      where: {
        id,
      },
      select: {
        id: true
      }
    });
    if(!user) return res.status(401).json({ error: 'error' });

    req.id = user.id;
  };
  
  // And then verify if thw jwt is correct, this have effect for sure
  await jwt.verify(token, process.env.AUTH || authConfig.secret, verifyLogin);

  next();
};

export default auth;
