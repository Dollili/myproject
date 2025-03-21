import {createContext, useEffect, useState} from "react";

export const UserContext = createContext(null);

export function UserProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const store = sessionStorage.getItem("user_Token");
        if (store) {
            setUser(JSON.parse(store));
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}
