import {createContext, useEffect, useState} from "react";

export const UserContext = createContext(null);

export function UserProvider({children}) {
    const store = sessionStorage.getItem("user");
    const init_store = {
        REGISTER_DATE: "",
        ROLE: "N",
        USER_ID: "",
        USER_NIC: "",
        USER_NM: "",
    };
    const [user, setUser] = useState(store ? JSON.parse(store) : init_store);

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
