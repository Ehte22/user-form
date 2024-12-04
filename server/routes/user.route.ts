import express from "express"
import * as userController from "../controller/user.controller"

const user_router = express.Router()

user_router
    .get("/", userController.getUsers)
    .post("/add-user", userController.addUser)
    .put("/update-user/:id", userController.updateUser)
    .delete("/delete-user/:id", userController.deleteUser)

export default user_router