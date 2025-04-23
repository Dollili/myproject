import {createContext, useEffect, useState} from "react";

export const UserContext = createContext(null);

export function UserProvider({children}) {
    const store = sessionStorage.getItem("user");
    const [user, setUser] = useState(store ? JSON.parse(store) : null);

    useEffect(() => {
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("time");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}
