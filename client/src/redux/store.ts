import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./apis/user.api";
import userSlice from "./slices/user.slice"
import authSlice from "./slices/auth.slice"
import { authApi } from "./apis/auth.api";


const reduxStore = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        user: userSlice,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware).concat(authApi.middleware),
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore