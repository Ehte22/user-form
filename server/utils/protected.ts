import { NextFunction, Request, Response } from "express"

import asyncHandler from "express-async-handler"
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// interface IRequest extends Request {
//     user?: string
// }

export const protectedRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    if (!req.cookies.auth) {
        return res.status(404).json({ message: "No cookie found" })
    }

    const JWT_KEY = process.env.JWT_KEY
    if (!JWT_KEY) {
        return res.status(404).json({ message: "JWT key not found" })
    }

    jwt.verify(req.cookies.auth, JWT_KEY, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: "JWT error" })
        }

        req.body.userId = decoded.userId
        next()
    })
})