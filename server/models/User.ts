import mongoose, { Model } from "mongoose";

export interface IUser {
    fname: string
    lname: string
    email: string
    phone: string
    time: string
    date: string
    city: string
    profile: string
    gender: string
    hobbies: string[]
    address: string
}

const userSchema = new mongoose.Schema<IUser>({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    city: { type: String, required: true },
    profile: { type: String, required: true },
    gender: { type: String, required: true },
    hobbies: { type: [String], required: true },
    address: { type: String, required: true },
}, { timestamps: true })

export const User: Model<IUser> = mongoose.model<IUser>("user", userSchema)
