import React, { useState, useEffect } from 'react';
import './dist/login.css';
import swal from 'sweetalert';
import LoadingCircle from '../LoadingCircle'
import ForgotPassword from './ForgotPassword'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import UpdatePassword from './UpdatePassword'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";


const Login = ({ setLoggedIn }) => {


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

                <div className='login__Nav'>
                    <Link className='login__navLogin' to="/">Login</Link>
                    <Link className='login__navRegister' to="/register">Create Account</Link>
                </div>

                <Switch>
                    <Route path="/register">
                        <RegisterPage setLoggedIn={setLoggedIn} />
                    </Route>
                    <Route path="/updatePassword">
                        <UpdatePassword />
                    </Route>
                    <Route path="/">
                        <LoginPage setLoggedIn={setLoggedIn} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

const LoginPage = ({ setLoggedIn }) => {
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

        < div >

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
                    <button onClick={handleEnterAsGuest(setLoggedIn)} className='login__Guest'>Enter as guest</button>
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


const handleEnterAsGuest = setLoggedIn => e => {

    fetch("/guest")
        .then((res) => res.json())
        .then(async (data) => {
            if (data.status === 'authorized') {
                await swal({
                    title: "Entering as Guest!",
                    text: 'Welcome',
                    icon: "success",
                    buttons: false,
                    timer: 1500,
                });
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        });
}



export { Login }
