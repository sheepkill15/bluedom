import React, {useEffect, useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { User, UserContext } from '../User'
import Login from './Login'

const Root = () => {
    const [user, setUser] = useState<User>({
        username: '',
        playerId: '',
        loggedIn: false
    });

    const navigate = useNavigate();
    useEffect(() => {
        if(user.loggedIn) {
            navigate('/home');
        }
    }, [user, navigate])

    return (
        <div>
            <UserContext.Provider value={{user, setUser}}>
                <NavBar />
                {user.loggedIn ? <Outlet /> : <Login />}
            </UserContext.Provider>
        </div>
    )
}

export default Root;