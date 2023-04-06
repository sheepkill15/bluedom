import React, { createContext } from "react";

export type User = {
    username: string;
    playerId: string;
    loggedIn: boolean;
};

export type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextType>({
    user: {
        username: '',
        playerId: '',
        loggedIn: false
    },
    setUser: () => {}
});