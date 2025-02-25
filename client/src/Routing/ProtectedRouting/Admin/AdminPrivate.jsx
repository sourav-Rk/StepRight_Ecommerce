import React  from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminPrivate = ({children}) =>{
    const {admin} = useSelector((state)=>state.admin);

    if(admin)
    {
        return children;
    }

    return <Navigate to={"/admin/login"} />
}

export default AdminPrivate