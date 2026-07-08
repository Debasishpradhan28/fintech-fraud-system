import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);

    }, []);

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {
    return useContext(AuthContext);
}