import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { User, UserContext } from '../User'
import Login from './Login'

const Root = () => {

    const [user, setUser] = useState<User>({
        username: '',
        playerId: '',
        loggedIn: false
    });

    return (
        <div>
            <NavBar />
            <UserContext.Provider value={{user, setUser}}>
                {user.loggedIn ? <Outlet /> : <Login />}
            </UserContext.Provider>
        </div>
    )
}

export default Root;