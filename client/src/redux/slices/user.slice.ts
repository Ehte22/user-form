import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../models/user.interface";

interface InitialState {
    selectedUser: IUser | null
}

const initialState: InitialState = {
    selectedUser: localStorage.getItem("selectedUser")
        ? JSON.parse(localStorage.getItem("selectedUser") as string)
        : null,
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setEditUser(state, { payload }) {
            state.selectedUser = payload
            localStorage.setItem("selectedUser", JSON.stringify(payload))
        },
        clearUser(state) {
            state.selectedUser = null
            localStorage.removeItem("selectedUser")
        }
    },
    extraReducers: builder => builder

})

export const { setEditUser, clearUser } = userSlice.actions
export default userSlice.reducer