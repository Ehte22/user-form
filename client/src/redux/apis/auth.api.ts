import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IAuth } from "../../models/auth.interface"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`, credentials: "include" }),
    tagTypes: ["auth"],
    endpoints: (builder) => {
        return {
            signUp: builder.mutation<{ message: string, result: IAuth }, IAuth>({
                query: userData => {
                    return {
                        url: "/sign-up",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string, result: IAuth }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                }
            }),

            signIn: builder.mutation<{ message: string, result: IAuth }, { username: string, password: string }>({
                query: userData => {
                    return {
                        url: "/sign-in",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string, result: IAuth }) => {
                    localStorage.setItem("auth", JSON.stringify(data.result))
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data
                }
            }),

            signOut: builder.mutation<{ message: string }, void>({
                query: () => {
                    return {
                        url: "/sign-out",
                        method: "POST",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    localStorage.removeItem("auth")
                    return data
                }
            }),

        }
    }
})

export const {
    useSignUpMutation,
    useSignInMutation,
    useSignOutMutation
} = authApi
