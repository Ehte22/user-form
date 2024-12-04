import { Request } from "express"
import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
        const fn = Date.now() + path.extname(file.originalname)
        cb(null, fn)
    }
})

export default multer({ storage }).single("profile")