import { useEffect, useState } from "react"
import { IUser } from "../models/user.interface"
import { useDeleteUserMutation, useGetUsersQuery } from "../redux/apis/user.api"
import { useNavigate } from "react-router-dom"
import { toast } from "../services/toast"
import Pagination from "../components/Pagination"
import io, { Socket } from "socket.io-client";

const socket: typeof Socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

const UserList = () => {
    const gender = [
        { value: "all", display: "All" },
        { value: "male", display: "Male" },
        { value: "female", display: "Female" }
    ]

    const [paginate, setPaginate] = useState<{ page: number, limit: number, totalPages: number }>({
        page: 1, limit: 5, totalPages: 0
    })
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [filterByGender, setFilterByGender] = useState<string>("all")
    const [sortByOrder, setSortByOrder] = useState<string>("ascending")
    const { data } = useGetUsersQuery({
        page: paginate.page,
        limit: paginate.limit,
        searchQuery: searchQuery.toLowerCase(),
        filterByGender: filterByGender.toLowerCase(),
        sortByOrder: sortByOrder.toLowerCase(),
    })

    const [result, setResult] = useState<IUser[]>()

    const [deleteUser, {
        data: deleteData,
        error: deleteError,
        isSuccess: isDeleteSuccess,
        isError: isDeleteError
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const handleEdit = (userData: IUser) => {
        navigate(`/edit/${userData._id}`)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.showSuccess(deleteData.message);

            if (data?.result.length === 1 && paginate.page > 1) {
                setPaginate((prev) => ({ ...prev, page: prev.page - 1 }));
            }
        }
        if (isDeleteError) {
            toast.showError(deleteError as string);
        }

        if (searchQuery || filterByGender !== "all") {
            setPaginate((prev) => ({ ...prev, page: 1 }));
        }
    }, [deleteData, deleteError, isDeleteSuccess, isDeleteError, data?.result, paginate.page, searchQuery, filterByGender]);

    useEffect(() => {
        if (data?.total) {
            const total = Math.ceil(data?.total / paginate.limit)
            setPaginate((prev) => ({ ...prev, totalPages: total }))
        }
    }, [data, paginate.totalPages, paginate.limit])

    useEffect(() => {

        socket.emit("searchQuery", {
            page: paginate.page,
            limit: paginate.limit,
            searchQuery: searchQuery.toLowerCase(),
            filterByGender: filterByGender.toLowerCase(),
            sortByOrder: sortByOrder.toLowerCase(),
        })

        socket.on("result", (data: IUser[]) => {
            if (data) {
                setResult(data)
            }


        });

        // Cleanup the listener on unmount
        return () => {
            socket.off("result");
        };
    }, [searchQuery, paginate.limit, paginate.page, filterByGender, sortByOrder])

    return <>
        <div className="container mt-5">
            <div className="d-flex justify-content-between">
                <div className="search-container">
                    <input type="search" className="form-control me-3" placeholder="Search"
                        onChange={(e) => handleSearch(e.target.value)} />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <button onClick={() => navigate("/user-form")} type="button" className="btn btn-primary">
                    <i className="fa-solid fa-plus"></i>&nbsp;
                    Add User
                </button>
            </div>

            <div className="row mt-4">
                <div className="col-lg-4 col-sm-6">
                    <h3>Filter By Gender</h3>
                    <div className="d-flex gap-3">
                        {
                            gender.map(item => <div key={item.value}>
                                <input type="radio" id={item.value} name="gen" value={item.value}
                                    checked={filterByGender === item.value}
                                    className="form-check-input me-2" onChange={(e) => setFilterByGender(e.target.value)} />
                                <label htmlFor={item.value} className="form-label">{item.display}</label>
                            </div>)
                        }
                    </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                    <h3>Sort By Date</h3>
                    <div className="dropdown">
                        <button className=" dropdown-toggle dropdown_btn no-arrow fs-4" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown">
                            <i className="fa-solid fa-sort text-primary"></i>
                        </button>
                        <ul className="dropdown-menu">
                            <li className="dropdown-item" onClick={() => setSortByOrder("ascending")}>Ascending</li>
                            <li className="dropdown-item" onClick={() => setSortByOrder("descending")}>Descending</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
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
                            {result && result.map((item, i) => <tr key={item._id}>
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

                <Pagination setPaginate={setPaginate} paginate={paginate} />
            </div>
        </div >
    </>
}

export default UserList