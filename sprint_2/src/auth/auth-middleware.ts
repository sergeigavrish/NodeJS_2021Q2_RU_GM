import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthorizationException } from '../shared/errors/authorization-exception';

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new AuthorizationException('Missing authorization header');
        }
        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AuthorizationException('Missing token');
        }
        verify(token, process.env.TOKEN_SECRET ?? '');
        return next()
    } catch (error) {
        return next(error);
    }
}