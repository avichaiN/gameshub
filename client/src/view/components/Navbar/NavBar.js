import './dist/navbar.css';
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";


import Leaderboard from '../Leaderboard/Leaderboard'
import LoginRegister from '../Login/Login'
import Games from '../Games/GamesNav'
import UpdatePassword from '../Login/UpdatePassword';

const NavBar = () => {
    const [game, setFromWhichGame] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [guestLoggedIn, setGuestLoggedIn] = useState(false)
    const [helloUsername, setHelloUsername] = useState('')

    useEffect(() => {
        fetch('/auth')
            .then(r => r.json())
            .then(r => {
                if (r.admin === true) {
                    setHelloUsername(r.user.username)
                    setLoggedIn(true)
                } else if (r.user === true) {
                    setHelloUsername(r.user.username)
                    setLoggedIn(true)
                }
            })
    }, [])
    return (

        <Router>
            <div className='navbar__container'>
                <nav className="navbar navbar-light bg-light mainTitle">
                    <div className="container-fluid">
                        <button className="btn navbar-brand ms-5">GameNoStop</button>

                        {loggedIn ? <button className="btn navbar-brand me-5">
                            Logged in as '{helloUsername}'
                        </button> : null}
                    </div>
                </nav>
                <div className='navbar__nav'>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <button className="btn navbar-brand ms-5">NavBar</button>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0 navBarContent">
                                    <li className="nav-item">
                                        <NavLink to='/' className='nav-link'>Games</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to='/leaderboard' onClick={() => setFromWhichGame('')} className='nav-link'>Leaderboard</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        {loggedIn ?
                                            <NavLink to='/login-register' exact onClick={() => logUserOut(setLoggedIn)} className='nav-link'>Logout</NavLink>
                                            :
                                            <NavLink to='/login-register' className='nav-link'>Sign in or Create account</NavLink>
                                        }
                                        {guestLoggedIn ? <button className=" btn nav-link">Hello Guest</button>
                                            : null}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>

                <Switch>
                    <Route path="/leaderboard">
                        <Leaderboard setFromWhichGame={setFromWhichGame} game={game} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                    </Route>
                    {loggedIn ? null :
                        <Route path='/login-register'>
                            <LoginRegister setLoggedIn={setLoggedIn} setGuestLoggedIn={setGuestLoggedIn} />
                        </Route>
                    }
                    <Route path='/updatePassword'>
                        <UpdatePassword />
                    </Route>
                    <Route path='/'>
                        <Games setFromWhichGame={setFromWhichGame} game={game} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                    </Route>
                </Switch>
            </div>
        </Router >
    )
}
const logUserOut = (setLoggedIn) => {
    fetch("/logout")
        .then(setLoggedIn(false))
}
export default NavBar