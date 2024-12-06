import mongoose, { Model } from "mongoose"

export interface IAuth {
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
}

const authSchema = new mongoose.Schema<IAuth>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

export const Auth: Model<IAuth> = mongoose.model<IAuth>("auth", authSchema)