import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { Navigate } from "react-router-dom"
import React from "react"

interface IProtected {
    compo: React.ReactNode
}

const Protected: React.FC<IProtected> = ({ compo }) => {
    const { auth } = useSelector((state: RootState) => state.auth)

    return auth ? compo : <Navigate to="/sign-in" />
}

export default Protected