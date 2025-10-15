import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"

const ProtectedRoute = () => {

    const { accessToken } = useAuth();


    if(!accessToken) {
        return <Navigate to={'/login'} replace/>
    }
    return <Outlet />
};

export default ProtectedRoute;