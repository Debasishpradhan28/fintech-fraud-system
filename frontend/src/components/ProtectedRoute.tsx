import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {

    children: any;

    roles: string[];

}

function ProtectedRoute({

    children,

    roles

}: Props) {

    const { user, loading } = useAuth();

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );

    }

    const savedUser = localStorage.getItem("user");

    const currentUser =
        user ||
        (savedUser ? JSON.parse(savedUser) : null);

    if (!currentUser) {

        return <Navigate to="/" replace />;

    }

    if (!roles.includes(currentUser.role)) {

        return <Navigate to="/access-denied" replace />;

    }

    return children;

}

export default ProtectedRoute;