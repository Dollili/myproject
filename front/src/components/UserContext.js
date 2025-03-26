import {createContext, useEffect, useState} from "react";

export const UserContext = createContext(null);

export function UserProvider({children}) {
    const store = sessionStorage.getItem("user_Token");
    const [user, setUser] = useState(store ? JSON.parse(store) : null);

    useEffect(() => {
        if (user) {
            sessionStorage.setItem("user_Token", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("user_Token");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}
