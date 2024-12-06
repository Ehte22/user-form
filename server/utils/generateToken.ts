import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const generateToken = (payload: Object): string => {
    const secretKey = process.env.JWT_KEY;
    const expiry = process.env.JWT_EXPIRY;

    if (!secretKey || !expiry) {
        throw new Error("JWT_KEY and JWT_EXPIRY must be defined");
    }

    return jwt.sign(payload, secretKey, { expiresIn: expiry });
}