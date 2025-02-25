import { useSelector } from "react-redux"

export const useAuth = ()=>{
    const user = useSelector((state) => state.user.user);
    const admin = useSelector((state) =>state.admin.admin);
    
    return {user, admin}
};

