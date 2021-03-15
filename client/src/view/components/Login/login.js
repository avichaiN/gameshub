import React, { useState, useEffect } from 'react';
import './dist/login.css';
import LoadingCircle from '../LoadingCircle/LoadingCircle'
import ForgotPassword from './ForgotPassword'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import UpdatePassword from './UpdatePassword'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
} from "react-router-dom";


const Login = ({ setLoggedIn, setGuestLoggedIn }) => {


    useEffect(() => {
        fetch('/checkCookie')
            .then(r => r.json())
            .then(data => {
                if (data.status === 'authorized') {
                    setLoggedIn(true)
                }
            })
    }, [])

    return (
        <Router>
            <div className='login__Container'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light navbarFather">
                    <div className="container-fluid">
                        <div className="navbar-expand navbarContainer">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbarContent">
                                <li className="nav-item">
                                    <NavLink exact to='/login-register' exact className='nav-link'>Sign in</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink exact to='/register' exact className='nav-link'>Create account</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <Switch>
                    <Route path="/register">
                        <RegisterPage setLoggedIn={setLoggedIn} />
                    </Route>
                    <Route path="/updatePassword">
                        <UpdatePassword />
                    </Route>
                    <Route path="/login-register">
                        <LoginPage setLoggedIn={setLoggedIn} setGuestLoggedIn={setGuestLoggedIn} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

const LoginPage = ({ setLoggedIn, setGuestLoggedIn }) => {
    const [forgotPassword, setForgotPassword] = useState(false)
    const [badCredentials, setBadCredentials] = useState(false)
    const [enterUsername, setEnterUsername] = useState(false)
    const [enterPassword, setEnterPassword] = useState(false)

    const [emptyUsernameColor, setUsernameColor] = useState('1px solid black')
    const [emptyPasswordColor, setPasswordColor] = useState('1px solid black')

    const [enterEmail, setEnterEmail] = useState(false)
    const [emptyEmailColor, setEmailColor] = useState('1px solid black')
    const [emailNotFound, setEmailNotFound] = useState(false)

    const [loadingCircle, setLoadingCircle] = useState(false)

    return (

        < div className='mainContainer bg-dark'>

            {!forgotPassword ?

                < div className='login__fromContainer'>

                    {loadingCircle ?
                        <LoadingCircle />
                        :
                        <LoginForm
                            setLoggedIn={setLoggedIn}
                            setForgotPassword={setForgotPassword}
                            setBadCredentials={setBadCredentials}
                            setEnterUsername={setEnterUsername}
                            setEnterPassword={setEnterPassword}
                            setUsernameColor={setUsernameColor}
                            setPasswordColor={setPasswordColor}
                            setLoadingCircle={setLoadingCircle}
                            badCredentials={badCredentials}
                            emptyUsernameColor={emptyUsernameColor}
                            emptyPasswordColor={emptyPasswordColor}
                            enterPassword={enterPassword}
                            enterUsername={enterUsername}
                        />
                    }
                </div>
                :
                <ForgotPassword
                    setEnterEmail={setEnterEmail}
                    setEmailColor={setEmailColor}
                    setEmailNotFound={setEmailNotFound}
                    setForgotPassword={setForgotPassword}
                    enterEmail={enterEmail}
                    emailNotFound={emailNotFound}
                    emptyEmailColor={emptyEmailColor}
                />
            }

        </div >
    )
}

const RegisterPage = ({ setLoggedIn }) => {

    return (
        <RegisterForm setLoggedIn={setLoggedIn} />
    )
}




export default Login
