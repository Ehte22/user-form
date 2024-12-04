import express, { Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from 'dotenv'
import user_router from "./routes/user.route"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use("/api/v1/user", user_router)

app.use("*", (req: Request, res: Response) => {
    res.status(400).json({ message: "Resource Not Found" })
})
app.use((err: any, req: Request, res: Response) => {
    res.status(500).json({ message: "something went wrong", })
})

mongoose.connect(process.env.MONGO_URL || '')

mongoose.connection.once("open", () => {
    console.log("MongoDb Connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running ${process.env.PORT}`)
    })
})
