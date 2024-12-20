import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddUserMutation, useGetUserQuery, useUpdateUserMutation } from "../redux/apis/user.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "../services/toast";

const UserForm = () => {
    const [addUser, { data: addData, error: addError, isSuccess, isError }] = useAddUserMutation()
    const [updateUser, { data: updateData, error: updateError, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateUserMutation()
    const navigate = useNavigate()
    // const selectedUser = useSelector((state: RootState) => state.user.selectedUser);
    const [profileUrl, setProfileUrl] = useState<string>("../../public/profile-1.avif")
    const { id } = useParams()
    const { data } = useGetUserQuery(id || "", {
        skip: !id,
    })



    const userSchema = z.object({
        fname: z.string().min(1, "*Field first name is required"),
        lname: z.string().min(1, "*Field last name is required"),
        email: z.string().email("Please enter a valid email"),
        phone: z
            .string()
            .regex(/^\d{10}$/, "Must be exactly 10 digits"),
        time: z.string().min(1, "Field time is required"),
        date: z.string().min(1, "Field date is required"),
        city: z.string().min(1, "Field city is required"),
        profile: z.union([
            z.instanceof(File, { message: "Profile file is required" })
                .refine((file) => file !== undefined, {
                    message: "Profile file is required",
                })
                .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
                    message: "File must be a JPEG or PNG image",
                }),
            z.string()
        ]),
        gender: z.string().min(1, "Field gender is required"),
        hobbies: z
            .array(z.string())
            .min(1, "At least one hobby is required"),
        address: z.string().min(1, "Field address is required"),
    })

    type FormValues = z.infer<typeof userSchema>;

    const genders = [
        { id: "male", value: "male", display: "Male" },
        { id: "female", value: "female", display: "Female" }
    ]

    const disabilityOptions = [
        { label: 'Coding', value: "coding" },
        { label: 'Trading', value: "trading" },
        { label: 'Sports', value: "sports" }
    ];

    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
        setValue
    } = useForm<FormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fname: "john1",
            lname: "doe",
            email: "john1@gmail.com",
            phone: "9898989898",
            time: "",
            date: "",
            city: "pune",
            gender: "",
            hobbies: [],
            address: "lorem",
        }
    });
    // const x = watch()

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setValue("profile", event.target.files[0]);

            const url = URL.createObjectURL(event.target.files[0])
            setProfileUrl(url)
        }
    };


    const onSubmit = (data: FormValues) => {

        const formData = new FormData()

        Object.keys(data).forEach((key) => {
            const value = data[key as keyof FormValues];

            if (value instanceof File) {
                // Append the file if it's a File object
                formData.append(key, value);
            } else if (typeof value === 'number' || typeof value === 'string') {
                // Convert number to string and append
                formData.append(key, value.toString());
            } else if (Array.isArray(value)) {
                // Append each item of the array separately
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            }
        });


        if (id) {
            updateUser({ userData: formData, id })
        } else {
            addUser(formData)
        }

    }

    useEffect(() => {
        if (isSuccess) {
            toast.showSuccess(addData.message)
            navigate("/")
        }
        if (isError) {
            toast.showError(addError as string)
        }
    }, [isSuccess, navigate, addData, isError, addError])

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.showSuccess(updateData.message)
            navigate("/")
        }

        if (isUpdateError) {
            toast.showError(updateError as string)
        }
    }, [isUpdateSuccess, navigate, updateData, isUpdateError, updateError])

    useEffect(() => {
        if (data?.result) {
            // Set form values from the selectedUser data
            setValue("fname", data.result.fname);
            setValue("lname", data.result.lname);
            setValue("email", data.result.email || "");
            setValue("phone", data.result.phone.toString());
            setValue("time", data.result.time);
            setValue("date", data.result.date);
            setValue("city", data.result.city);
            setValue("gender", data.result.gender);
            setValue("hobbies", data.result.hobbies);
            setValue("address", data.result.address);
            setValue("profile", data.result.profile);

            if (data.result.profile) {
                if (data.result.profile instanceof File) {
                    setProfileUrl(URL.createObjectURL(data.result.profile));
                } else {
                    setProfileUrl(data.result.profile);
                }
            }
        }
    }, [data, setValue]);
    return <>
        <div className="container">
            <div className="card shadow mt-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body px-5">
                        <div className="text-center my-2">
                            <img className="profile-main" src={profileUrl} alt="" />
                        </div>
                        <div className="row my-3">
                            <div className="col-lg-4">
                                <div>
                                    <label htmlFor="fname" className="form-label">First Name</label>
                                    <input type="text" id="fname" {...register("fname")}
                                        className="form-control" placeholder="Enter Your First Name" />
                                    <p className="text-danger">{errors.fname?.message}</p>

                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div>
                                    <label htmlFor="lname" className="form-label">Last Name</label>
                                    <input type="text" id="lname" {...register("lname")}
                                        className="form-control" placeholder="Enter Your Last Name" />
                                    <p className="text-danger">{errors.lname?.message}</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div>
                                    <label htmlFor="phone" className="form-label">Mobile Number</label>
                                    <input type="number" id="phone" {...register("phone")}
                                        className="form-control" placeholder="Enter Your Mobile Numbers" />
                                    <p className="text-danger">{errors.phone?.message}</p>
                                </div >
                            </div >

                            <div className="col-sm-12">
                                <div className="row my-3">
                                    <div className="col-lg-4">
                                        <div>
                                            <label htmlFor="email" className="form-label">Enter Email</label>
                                            <input type="text" id="email" {...register("email")}
                                                className="form-control" placeholder="Enter Your Email" />
                                            <p className="text-danger">{errors.email?.message}</p>
                                        </div>
                                    </div >
                                    <div className="col-lg-4">
                                        <div>
                                            <label htmlFor="time" className="form-label">Time</label>
                                            <input type="time" id="time" {...register("time")}
                                                className="form-control" placeholder="Enter Your Last Name" />
                                            <p className="text-danger">{errors.time?.message}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div>
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input type="date" id="date" {...register("date")}
                                                className="form-control" placeholder="Enter Your Mobile Numbers" />
                                            <p className="text-danger">{errors.date?.message}</p>
                                        </div>
                                    </div>
                                </div >
                            </div>

                            <div className="col-sm-12">
                                <div className="row my-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <select id="city" className="form-select" {...register("city")}>
                                            <option value="" hidden>Select Your City</option>
                                            <option value="mumbai">Mumbai</option>
                                            <option value="pune">Pune</option>
                                            <option value="bangalore">Bangalore</option>
                                        </select>
                                        <p className="text-danger">{errors.city?.message}</p>
                                    </div>

                                    <div className="col-lg-4">
                                        <label htmlFor="profile" className="form-label">Profile</label>
                                        <input type="file" id="profile" className="form-control"
                                            onChange={handleFileChange} />
                                        <p className="text-danger">{errors.profile?.message}</p>
                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="gender">Gender</label>
                                        <div className="d-flex mt-1">
                                            {
                                                genders.map((item) => <div key={item.id} className="ms-2" >
                                                    <input type="radio" id={item.id} {...register("gender")}
                                                        value={item.value} className="form-check-input" />
                                                    <label htmlFor={item.id} className="form-label ms-2">{item.display}</label>
                                                </div>)
                                            }
                                        </div >
                                        <p className="text-danger">{errors.gender?.message}</p>
                                    </div >

                                    <div className="col-lg-4">
                                        <label className="form-label">Hobbies</label>
                                        <div className="d-flex mt-1">
                                            {disabilityOptions.map(item => <div key={item.value} className="me-3">
                                                <label>
                                                    <input type="checkbox" {...register("hobbies")} value={item.value}
                                                        className="me-1" />
                                                    {item.label}
                                                </label>
                                            </div>)}
                                        </div>
                                        <p className="text-danger">{errors.hobbies?.message}</p>
                                    </div >

                                    <div className="col-lg-8">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <div>
                                            <textarea id="address" className="form-control" {...register("address")}
                                                placeholder="Enter Here"></textarea>
                                            <p className="text-danger">{errors.address?.message}</p>
                                        </div>
                                    </div>
                                </div >
                            </div>




                            <div className="text-end mt-5">
                                <button type="submit" className="btn btn-primary w-100px ms-2">Save</button>
                                <button type="button" className="btn btn-secondary w-100px ms-2">Cancel</button>
                            </div>
                        </div >
                    </div>

                </form >
            </div >
        </div >
    </>
}

export default UserForm