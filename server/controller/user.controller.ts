import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { User } from '../models/User'
import upload from '../utils/upload'
import cloudinary from '../utils/uploadConfig'
import { io } from '../socket/socket'
import { SortOrder } from 'mongoose'

export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<any> => {

    const page = req.query.page as string || "1"
    const limit = req.query.limit as string || "5"
    const searchQuery = req.query.searchQuery as string
    const filterByGender = req.query.filterByGender as string
    const sortByOrder = req.query.sortByOrder as string || "ascending";


    const currentPage: number = parseInt(page)
    const limitPerPage: number = parseInt(limit)

    const skip: number = (currentPage - 1) * limitPerPage

    const sort: { [key: string]: SortOrder } = (sortByOrder === "descending") ? { createdAt: -1 } : { createdAt: 1 }

    io
    const query = {
        $and: [
            searchQuery
                ? {
                    $or: [
                        { fname: new RegExp(searchQuery, 'i') },
                        { lname: new RegExp(searchQuery, 'i') },
                    ],
                }
                : {},
            filterByGender !== 'all' ? { gender: filterByGender } : {},
        ],
    };

    const total = await User.countDocuments(query)

    const result = await User.find(query).sort(sort).skip(skip).limit(limitPerPage)
    io.emit("result", result)

    res.status(200).json({ message: "Users Fetch Successfully", result, total, page, limit })
})

export const getUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const result = await User.findById(id)
    res.status(200).json({ message: "User Fetch Successfully", result })
})

export const addUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    upload(req, res, async (err: any) => {

        if (err) {
            return res.status(400).json({ message: err.message || 'Upload error' })
        }

        let profileUrl
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            profileUrl = secure_url
        }

        await User.create({ ...req.body, profile: profileUrl })
        res.status(200).json({ message: 'User Add Successfully' })
    })
})

export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    upload(req, res, async (err: any) => {

        if (err) {
            return res.status(400).json({ message: err.message || 'Upload error' })
        }

        const { id } = req.params

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profileUrl
        if (req.file) {
            try {
                const publicId = user.profile.split('/').pop()?.split('.')[0]
                publicId && await cloudinary.uploader.destroy(publicId)

                const { secure_url } = await cloudinary.uploader.upload(req.file.path)
                profileUrl = secure_url
            } catch (error: any) {
                return res.status(500).json({ message: 'Failed to upload new image', error: error.message });
            }
        }

        await User.findByIdAndUpdate(id, { ...req.body, profile: profileUrl })
        res.status(200).json({ message: 'User Update Successfully' })
    })
})

export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const result = await User.findById(id)
    if (!result) {
        return res.status(404).json({ message: "User Not Found" })
    }

    if (result.profile) {
        const publicId = result.profile.split('/').pop()?.split('.')[0]
        publicId && await cloudinary.uploader.destroy(publicId)
    }

    await User.findByIdAndDelete(id)
    res.status(200).json({ message: 'User Delete Successfully' })
}) 