import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { useSignInMutation } from "../redux/apis/auth.api"
import { useEffect } from "react"
import { toast } from "../services/toast"

const Login = () => {
    const [signIn, { data, error, isSuccess, isError }] = useSignInMutation()
    const navigate = useNavigate()

    const schema = z.object({
        username: z.string().min(1, "*Field username is required"),
        password: z.string().min(1, "*Field password is required"),
    })

    type FormValues = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = (data: FormValues) => {
        signIn(data)
    }

    useEffect(() => {
        if (isSuccess) {
            toast.showSuccess(data.message)
            navigate("/")
        }
        if (isError) {
            toast.showError((error as { message: string }).message);

        }
    }, [isSuccess, navigate, data, isError, error])

    return <>
        {/* <pre>{JSON.stringify(error, null, 2)}</pre> */}
        <div className="vh-100 vw-100 overflow-hidden  bg-dark px-5">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-sm-10 col-md-7 col-lg-6 col-xl-5 col-xxl-4 bg-light h-75 py-5 px-3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3 className="text-center mt-5">SIGN IN</h3>
                        <div className="d-flex align-content-center mt-5">
                            <div className="w-50">
                                <input type="text" {...register("username")}
                                    className="w-100 p-2 inp-placeholder inp-focus" placeholder="Username" />
                                <p className="text-danger">{errors.username?.message}</p>
                            </div>
                            <div className="w-50">
                                <input type="text" {...register("password")}
                                    className="w-100 p-2 inp-placeholder inp-focus" placeholder="Password" />
                                <p className="text-danger">{errors.password?.message}</p>
                            </div>
                        </div>

                        <button type="submit"
                            className="btn-green btn-hover border-0 mt-4 text-white fw-bold w-100 py-2 letter-spacing-xs">
                            <small>SIGN IN</small>
                        </button>
                        <div className="d-flex justify-content-center mt-4">
                            <div id="google-btn"></div>
                        </div>
                    </form>
                    <div className="text-center link-margin">
                        <Link to="/sign-up" className="text-decoration-none link-deco ">Sign
                            Up</Link>
                    </div>
                </div >
            </div >
        </div >
    </>
}

export default Login