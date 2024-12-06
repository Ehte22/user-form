import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IUser } from "../../models/user.interface"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`, credentials: "include" }),
    // baseQuery: fetchBaseQuery({ baseUrl: "https://user-form-server-eight.vercel.app/api/v1/user", credentials: "include" }),
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            getUsers: builder.query<{ result: IUser[], total: number, page: number, limit: number }, {
                page: number,
                limit: number,
                searchQuery: string,
                filterByGender: string,
                sortByOrder: string
            }>({
                query: (queryParams) => {
                    console.log(queryParams);

                    return {
                        url: "/",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IUser[], total: number, page: number, limit: number }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["user"]
            }),

            getUser: builder.query<{ message: string, result: IUser }, string>({
                query: id => {
                    return {
                        url: `/get-user/${id}`,
                        method: "GET",
                    }
                },
                transformResponse: (data: { message: string, result: IUser }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["user"],
            }),

            addUser: builder.mutation<{ message: string }, FormData>({
                query: userData => {
                    return {
                        url: "/add-user",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"],
            }),

            updateUser: builder.mutation<{ message: string }, { userData: FormData; id: string }>({
                query: ({ userData, id }) => {
                    return {
                        url: `/update-user/${id}`,
                        method: "PUT",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

            deleteUser: builder.mutation<{ message: string }, string>({
                query: (id) => {
                    return {
                        url: `/delete-user/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

        }
    }
})

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApi
