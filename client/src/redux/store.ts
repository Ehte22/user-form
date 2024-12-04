import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./apis/user.api";
import userSlice from "./slices/user.slice"


const reduxStore = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        user: userSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware),
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore