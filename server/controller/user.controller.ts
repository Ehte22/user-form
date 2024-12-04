import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { User } from '../models/User'
import upload from '../utils/upload'
import cloudinary from '../utils/uploadConfig'

export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await User.find()
    res.status(200).json({ message: "Users Fetch Successfully", result })
})

export const addUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    upload(req, res, async (err: any) => {
        console.log(req);

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
        console.log(req.body);
        console.log(req.file);

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