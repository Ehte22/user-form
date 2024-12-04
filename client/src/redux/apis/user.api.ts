import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IUser } from "../../models/user.model"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/user" }),
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            getUsers: builder.query<IUser[], void>({
                query: () => {
                    return {
                        url: "/",
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IUser[] }) => {
                    return data.result
                },
                providesTags: ["user"]
            }),
            addUser: builder.mutation<void, FormData>({
                query: userData => {
                    return {
                        url: "/add-user",
                        method: "POST",
                        body: userData
                    }
                },
                invalidatesTags: ["user"]
            }),
            updateUser: builder.mutation<void, { userData: FormData; id: string }>({
                query: ({ userData, id }) => {
                    return {
                        url: `/update-user/${id}`,
                        method: "PUT",
                        body: userData
                    }
                },
                invalidatesTags: ["user"]
            }),

            deleteUser: builder.mutation<void, string>({
                query: (id) => {
                    return {
                        url: `/delete-user/${id}`,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["user"]
            }),

        }
    }
})

export const {
    useGetUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApi
