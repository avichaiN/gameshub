import './dist/navbar.css';
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
} from "react-router-dom";


import Leaderboard from '../Leaderboard/Leaderboard'
import LoginRegister from '../Login/Login'
import Games from '../Games/GamesNav'

const NavBar = () => {
    const [game, setFromWhichGame] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [guestLoggedIn, setGuestLoggedIn] = useState(false)

    useEffect(() => {
        fetch('/auth')
            .then(r => r.json())
            .then(r => {
                if (r.admin === true) {
                    setLoggedIn(true)
                } else if (r.user === true) {
                    setLoggedIn(true)
                }
            })
    }, [])
    return (

        <Router>
            <div className='navbar__container'>
                <nav className="navbar navbar-light bg-light mainTitle">
                    <div className="container-fluid">
                        <a class="navbar-brand ms-5" href="#">
                            GameNoStop
                        </a>
                    </div>
                </nav>
                <div className='navbar__nav'>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand ms-5" href="#">NavBar</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0 navBarContent">
                                    <li className="nav-item">
                                        <NavLink to='/' exact className='nav-link'>Games</NavLink>
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
                                        {guestLoggedIn ? <a className="nav-link" href="#">Hello Guest</a>
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