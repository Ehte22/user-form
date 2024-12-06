import express from "express"
import http from "http"
import { SortOrder } from "mongoose"
import { Server } from "socket.io"
import { User } from "../models/User"

export const app = express()
export const server = http.createServer(app)
export const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: "https://user-form-ochre.vercel.app",
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("searchQuery", async (data) => {
        console.log(data, "hello");

        const page = data.page as string || "1"
        const limit = data.limit as string || "5"
        const searchQuery = data.searchQuery as string
        const filterByGender = data.filterByGender as string
        const sortByOrder = data.sortByOrder as string || "ascending";


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
        io.emit("result", result); // Broadcast to all connected clients
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });


})
