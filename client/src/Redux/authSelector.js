import { useSelector } from "react-redux"

export const useAuth = ()=>{
    const user = useSelector((state) => state.user.user);
    
    return {user}
};

