import express from "express"
import * as authController from "../controller/auth.controller"

const auth_router = express.Router()

auth_router
    .post("/sign-up", authController.signUp)
    .post("/sign-in", authController.signIn)
    .post("/sign-out", authController.signOut)

export default auth_router