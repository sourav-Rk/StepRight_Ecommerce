import React from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserLoginPrivate = ({children}) => {
    
    const {user} = useSelector((state)=>state.user)

    if(user)
    {
        return <Navigate to={"/"}/>
    }
    return children;
}

export default UserLoginPrivate