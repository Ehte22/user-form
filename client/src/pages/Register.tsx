import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { useSignUpMutation } from "../redux/apis/auth.api";
import { useEffect } from "react";
import { toast } from "../services/toast";

const Register = () => {
  const [signUp, { data, error, isSuccess, isError }] = useSignUpMutation()
  const navigate = useNavigate()

  const schema = z.object({
    name: z.string().min(1, "*Field name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string()
      .min(1, "*Field phone is required")
      .regex(/^\d{10}$/, "Must be exactly 10 digits"),
    password: z.string().min(1, "*Field password is required"),
  })

  type FormValues = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormValues) => {
    signUp(data)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.showSuccess(data.message)
      navigate("/sign-in")
    }
    if (isError) {
      toast.showError(error as string)
    }
  }, [data, error, isSuccess, isError, navigate])


  return <>
    <div className="vh-100 vw-100 overflow-hidden  bg-dark px-5">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-sm-10 col-md-7 col-lg-6 col-xl-5 col-xxl-4 bg-light h-75 px-3 pt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-center mb-4">SIGN UP</h3>
            <div className="my-3">
              <input type="text" {...register("name")}
                className="w-100 px-2 inp-placeholder inp-focus pad-4" placeholder="Enter Your Name" />
              <p className="text-danger">{errors.name?.message}</p>
            </div>
            <div className="my-3">
              <input type="text" {...register("email")}
                className="w-100 px-2 pad-4 inp-placeholder inp-focus" placeholder="Enter Your Email" />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
            <div className="my-3">
              <input type="text" {...register("phone")}
                className="w-100 px-2 pad-4 inp-placeholder inp-focus" placeholder="Enter Your Phone Number" />
              <p className="text-danger">{errors.phone?.message}</p>
            </div >
            <div className="my-3 ">
              <input type="text" {...register("password")}
                className="w-100 px-2 pad-4 inp-placeholder inp-focus" placeholder="Password" />
              <p className="text-danger">{errors.password?.message}</p>
            </div>


            <button type="submit"
              className="btn-green btn-hover border-0 mt-4 text-white fw-bold w-100 py-2 letter-spacing-xs">
              <small>SIGN UP</small>
            </button>
          </form >
          <div className="text-center mt-3">
            If your already have an account?
            <Link to="/sign-in" className="text-decoration-none link-deco fw-semibold"> Sign In</Link>
          </div >
        </div >
      </div >
    </div >
  </>
}

export default Register