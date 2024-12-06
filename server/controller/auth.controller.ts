import { Request, Response } from "express"
import { Auth } from "../models/Auth"
import { generateToken } from "../utils/generateToken"

const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")

export const signUp = asyncHandler(async (req: Request, res: Response): Promise<any> => {

    const { email, password } = req.body

    const user = await Auth.findOne({ email })
    if (user) {
        return res.status(400).json({ message: "Email already exist" })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const result = await Auth.create({ ...req.body, password: hashPassword })

    res.status(200).json({
        message: "User SignUp Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            phone: result.phone,
            role: result.role
        }
    })

})

export const signIn = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body

    const result = await Auth.findOne({
        $or: [
            { email: username },
            { phone: username },
        ]
    })

    if (!result) {
        return res.status(400).json({ message: "Invalid Credential - Username do not match" })
    }

    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(400).json({ message: "Invalid Credential - Password do not match" })
    }

    const token = generateToken({ userId: result._id })

    res.cookie("auth", token, { maxAge: 864000000, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "none" })

    res.status(200).json({
        message: "User Login Success", result: {
            _id: result._id,
            name: result.name,
            username: result.email
        }
    })
})

export const signOut = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    res.clearCookie("auth")
    res.status(200).json({ message: "User Logout Success" })
})