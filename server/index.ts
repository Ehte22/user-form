import express, { Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from 'dotenv'
import user_router from "./routes/user.route"
import auth_router from "./routes/auth.route"
import cookieParser = require("cookie-parser")
import { protectedRoute } from "./utils/protected"
import { app, server } from "./socket/socket"

dotenv.config()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    // origin: "https://user-form-ochre.vercel.app",
    credentials: true
}))
app.use(cookieParser())


app.use("/api/v1/user", protectedRoute, user_router)
app.use("/api/v1/auth", auth_router)

app.use("*", (req: Request, res: Response) => {
    res.status(400).json({ message: "Resource Not Found" })
})
app.use((err: any, req: Request, res: Response) => {
    res.status(500).json({ message: "something went wrong", })
})

mongoose.connect(process.env.MONGO_URL || '')

mongoose.connection.once("open", () => {
    console.log("MongoDb Connected");
    server.listen(process.env.PORT, () => {
        console.log(`Server is running ${process.env.PORT}`)
    })
})
