import { useDispatch } from "react-redux"
import { IUser } from "../models/user.model"
import { useDeleteUserMutation, useGetUsersQuery } from "../redux/apis/user.api"
import { setEditUser } from "../redux/slices/user.slice"
import { useNavigate } from "react-router-dom"

const UserList = () => {
    const { data } = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleEdit = (userData: IUser) => {
        dispatch(setEditUser(userData))
        navigate("/user-form")
    }

    return <>
        <div className="container">
            <div className="row">
                <h4 className="mt-5">Users List</h4>

                <div className="table-responsive mt-2">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Profile</th>
                                <th>Gender</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((item, i) => <tr key={item._id}>
                                <td>{i + 1}</td>
                                <td>{item.fname} {item.lname}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td className="text-center">
                                    <img className="profile"
                                        src={item.profile instanceof File
                                            ? URL.createObjectURL(item.profile) :
                                            item.profile} alt={item.fname} />
                                </td>
                                <td>{item.gender}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="btn btn-outline-warning ms-2 btn-sm">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(item._id ? item._id : "")}
                                        className="btn btn-outline-danger ms-2 btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}

export default UserList